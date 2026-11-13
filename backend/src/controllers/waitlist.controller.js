const waitlistModel = require('../models/waitlist.model');
const appointmentModel = require('../models/appointment.model');
const { todayInClinic } = require('../config/clinic');
const { isValidDate } = require('../utils/validate');

const MAX_ACTIVE_ENTRIES = 5;   // per patient, so one person can't flood the list
const MAX_WINDOW_DAYS = 90;     // how far apart date_from and date_to can be

const toId = (v) => (/^\d{1,9}$/.test(String(v)) && Number(v) > 0 ? Number(v) : null);
const daysBetween = (a, b) => Math.round((new Date(b + 'T00:00:00Z') - new Date(a + 'T00:00:00Z')) / 864e5);

// GET /api/waitlist/options — providers and appointment types for the form.
async function getOptions(req, res, next) {
  try {
    res.json(await appointmentModel.findOptions());
  } catch (err) { next(err); }
}

// GET /api/waitlist/mine — the logged-in patient's active entries.
async function getMine(req, res, next) {
  try {
    res.json({ entries: await waitlistModel.findActiveByPatient(req.user.id) });
  } catch (err) { next(err); }
}

// POST /api/waitlist  { providerId | null, appointmentTypeId, dateFrom, dateTo }
async function join(req, res, next) {
  try {
    const { providerId, appointmentTypeId, dateFrom, dateTo } = req.body || {};
    const today = todayInClinic();

    if (!isValidDate(dateFrom) || !isValidDate(dateTo)) {
      return res.status(400).json({ error: 'Pick a start and end date' });
    }
    if (dateFrom < today) return res.status(400).json({ error: 'Start date cannot be in the past' });
    if (dateTo < dateFrom) return res.status(400).json({ error: 'End date must be on or after the start date' });
    if (daysBetween(dateFrom, dateTo) > MAX_WINDOW_DAYS) {
      return res.status(400).json({ error: `Pick a window of ${MAX_WINDOW_DAYS} days or less` });
    }

    const typeId = toId(appointmentTypeId);
    if (!typeId || !(await waitlistModel.appointmentTypeExists(typeId))) {
      return res.status(400).json({ error: 'Pick an appointment type' });
    }

    let provId = null; // null/"" = any provider
    if (providerId !== null && providerId !== undefined && providerId !== '') {
      provId = toId(providerId);
      if (!provId || !(await waitlistModel.providerIsBookable(provId))) {
        return res.status(400).json({ error: 'Pick a provider from the list' });
      }
    }

    const existing = await waitlistModel.findActiveByPatient(req.user.id);
    if (existing.length >= MAX_ACTIVE_ENTRIES) {
      return res.status(400).json({ error: `You can be on the waitlist up to ${MAX_ACTIVE_ENTRIES} times. Remove one first.` });
    }

    const entry = await waitlistModel.create({
      patientId: req.user.id, providerId: provId, appointmentTypeId: typeId, dateFrom, dateTo,
    });
    res.status(201).json({ id: entry.id });
  } catch (err) { next(err); }
}

// DELETE /api/waitlist/:id — leave the waitlist (own entries only).
async function leave(req, res, next) {
  try {
    const id = toId(req.params.id);
    if (!id || !(await waitlistModel.remove(id, req.user.id))) {
      return res.status(404).json({ error: 'Not found' });
    }
    res.json({ id, status: 'removed' });
  } catch (err) { next(err); }
}

module.exports = { getOptions, getMine, join, leave };
