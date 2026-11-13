const appointmentModel = require('../models/appointment.model');
const waitlistService = require('../services/waitlist.service');
const bookingService = require('../services/booking.service');
const { generateSlots } = require('../services/slotGenerator.service');
const { todayInClinic } = require('../config/clinic');
const { isValidDate } = require('../utils/validate');

const MAX_SEARCH_DAYS = 31;
const addDays = (ymd, n) => { const d = new Date(ymd + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
const optionalId = (v) => (v === undefined || v === null || v === '' ? undefined : parseId(String(v)));

// Route ids must be positive integers; anything else is treated as not found.
const parseId = (raw) => (/^\d{1,9}$/.test(raw) && Number(raw) > 0 ? Number(raw) : null);

// Providers, appointment types, specialties for the booking form.
// GET /api/appointments/options
async function getOptions(req, res, next) {
  try {
    res.json(await appointmentModel.findOptions());
  } catch (err) { next(err); }
}

// Open slots, filtered by provider / specialty / dates (sprint log #305, #307).
// GET /api/appointments/search?appointmentTypeId=1&from=YYYY-MM-DD&to=YYYY-MM-DD&providerId=&specialty=
// Returns open times only, never who holds the taken ones (HIPAA).
async function searchOpenSlots(req, res, next) {
  try {
    const q = req.query;
    const appointmentTypeId = parseId(String(q.appointmentTypeId || ''));
    if (!appointmentTypeId) return res.status(400).json({ error: 'Pick an appointment type' });

    const providerId = optionalId(q.providerId);
    if (providerId === null) return res.status(400).json({ error: 'Pick a provider from the list' });

    const specialty = q.specialty ? String(q.specialty).slice(0, 100) : null;

    const today = todayInClinic();
    let from = q.from || today;
    if (!isValidDate(from)) return res.status(400).json({ error: 'from must be YYYY-MM-DD' });
    if (from < today) from = today;
    const to = q.to || addDays(from, 6);
    if (!isValidDate(to)) return res.status(400).json({ error: 'to must be YYYY-MM-DD' });
    if (to < from) return res.status(400).json({ error: 'to must be on or after from' });
    if (addDays(from, MAX_SEARCH_DAYS - 1) < to) {
      return res.status(400).json({ error: `Search up to ${MAX_SEARCH_DAYS} days at a time` });
    }

    const slots = await generateSlots({ appointmentTypeId, from, to, providerId: providerId || null, specialty });
    res.json({ from, to, slots });
  } catch (err) { next(err); }
}

// Patient's own upcoming appointments (sprint log #327-330, #332).
// GET /api/appointments/mine — scoped strictly to req.user.id, never a URL
// param, so a patient can only ever see their own (CLAUDE.md HIPAA constraint).
async function getMyAppointments(req, res, next) {
  try {
    const appointments = await appointmentModel.findByPatient(req.user.id);
    res.json({ appointments });
  } catch (err) { next(err); }
}

// Book a slot (sprint log #311-313, #478-480).
// POST /api/appointments  { providerId, appointmentTypeId, startAt (ISO) [, patientId for Receptionist] }
// Patients always book for themselves (patient id from the session, never the body).
async function bookAppointment(req, res, next) {
  try {
    const { role, id: userId } = req.user;
    if (role !== 'patient' && role !== 'receptionist') {
      return res.status(403).json({ error: 'Not authorized' });
    }
    const body = req.body || {};
    const providerId = optionalId(body.providerId);
    const appointmentTypeId = optionalId(body.appointmentTypeId);
    const startAt = new Date(body.startAt);
    if (!providerId) return res.status(400).json({ error: 'Pick a provider from the list' });
    if (!appointmentTypeId) return res.status(400).json({ error: 'Pick an appointment type' });
    if (typeof body.startAt !== 'string' || Number.isNaN(startAt.getTime())) {
      return res.status(400).json({ error: 'Pick a time' });
    }

    let patientId = userId;
    if (role === 'receptionist') {
      patientId = optionalId(body.patientId);
      if (!patientId) return res.status(400).json({ error: 'patientId is required' });
    }

    const booked = await bookingService.bookSlot({
      patientId, providerId, appointmentTypeId, startAt, bookedBy: role,
    });
    res.status(201).json({ appointment: booked });
  } catch (err) { next(err); }
}

// TODO: move appointment, free original slot (sprint log #323, #485)
async function rescheduleAppointment(req, res, next) {
  res.status(501).json({ error: 'Not implemented: rescheduleAppointment' });
}

// Cancel (sprint log #342, #344, #507-508). Patients can cancel only their
// own future appointments; Receptionists can cancel any future one (phone
// cancellations). Cancelled rows are excluded from no-show math (#343)
// because status is 'cancelled', not 'no_show'. The freed slot then goes
// to the waitlist (fire-and-forget: email trouble never blocks the cancel).
// PUT /api/appointments/:id/cancel
async function cancelAppointment(req, res, next) {
  try {
    const { role, id: userId } = req.user;
    if (role !== 'patient' && role !== 'receptionist') {
      return res.status(403).json({ error: 'Not authorized' });
    }
    const id = parseId(req.params.id);
    const cancelled = id && await appointmentModel.cancel(id, { patientId: role === 'patient' ? userId : null });
    if (!cancelled) {
      // Same message whether it doesn't exist, isn't theirs, or already passed (no PHI leak).
      return res.status(404).json({ error: 'Appointment not found or can no longer be cancelled' });
    }
    waitlistService.notifyForFreedSlot(cancelled);
    res.json({ id: cancelled.id, status: 'cancelled' });
  } catch (err) { next(err); }
}

// Receptionist check-in: patient arrived at the front desk.
// PUT /api/appointments/:id/check-in   (Receptionist only, see routes)
async function checkIn(req, res, next) {
  try {
    const id = parseId(req.params.id);
    const row = id && await appointmentModel.checkIn(id, req.user.id);
    if (!row) {
      return res.status(409).json({ error: "Can't check in: the appointment isn't today, is already checked in, or is no longer booked" });
    }
    res.json({ id: row.id, checked_in_time: row.checked_in_time });
  } catch (err) { next(err); }
}

// Undo a check-in made by mistake.
// DELETE /api/appointments/:id/check-in   (Receptionist only)
async function undoCheckIn(req, res, next) {
  try {
    const id = parseId(req.params.id);
    const row = id && await appointmentModel.undoCheckIn(id);
    if (!row) return res.status(409).json({ error: 'This appointment is not checked in' });
    res.json({ id: row.id, checked_in_time: null });
  } catch (err) { next(err); }
}

// TODO: set completed/no-show/cancelled (sprint log #96, #438)
async function updateStatus(req, res, next) {
  res.status(501).json({ error: 'Not implemented: updateStatus' });
}

// TODO: mark PA-led visit as signed off by supervising Physician
// (sprint log #276, #443)
async function signOff(req, res, next) {
  res.status(501).json({ error: 'Not implemented: signOff' });
}

// TODO: save note linked to appointment/author/timestamp, RBAC-gated
// (sprint log #216-217)
async function addVisitNote(req, res, next) {
  res.status(501).json({ error: 'Not implemented: addVisitNote' });
}

// TODO: fetch notes for an appointment, never visible to patients
// (sprint log #217-218)
async function getVisitNotes(req, res, next) {
  res.status(501).json({ error: 'Not implemented: getVisitNotes' });
}

module.exports = {
  getOptions,
  searchOpenSlots,
  getMyAppointments,
  bookAppointment,
  rescheduleAppointment,
  cancelAppointment,
  checkIn,
  undoCheckIn,
  updateStatus,
  signOff,
  addVisitNote,
  getVisitNotes,
};
