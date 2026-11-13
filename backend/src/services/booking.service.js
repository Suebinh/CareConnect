// Books one slot (sprint log #311-312, #314, #478-480), optionally replacing
// an existing appointment (reschedule, #323, #349).
//
// Race safety: inside one transaction we lock the provider's and patient's
// account rows (FOR UPDATE, in id order so two bookings can't deadlock),
// then re-check that the slot is still open. A second patient trying the
// same slot waits for the first transaction, then sees it's taken.

const db = require('../config/db');
const { CLINIC_TZ, CLINIC_LOCATION } = require('../config/clinic');
const { generateSlots } = require('./slotGenerator.service');
const conflictCheck = require('./conflictCheck.service');
const emailService = require('./email.service');

const httpError = (status, message) => Object.assign(new Error(message), { status });
const TAKEN = 'Sorry, that time was just taken. Please pick another.';

// Runs inside the caller's transaction (`client` has already run BEGIN).
// replaceAppointmentId: cancel that appointment (must be this patient's, booked,
// in the future) in the same transaction, so a reschedule never leaves the
// patient with both or neither.
// Returns { booked, replaced } where replaced is the cancelled row (or null).
async function bookSlotWithClient(client, { patientId, providerId, appointmentTypeId, startAt, bookedBy, replaceAppointmentId = null }) {
  const locked = await client.query(
    `SELECT id, role, status FROM accounts WHERE id = ANY($1::int[]) ORDER BY id FOR UPDATE`,
    [[patientId, providerId]]
  );
  const provider = locked.rows.find((r) => r.id === providerId);
  const patient = locked.rows.find((r) => r.id === patientId);
  if (!provider || provider.status !== 'active' || !['physician', 'physician_assistant'].includes(provider.role)) {
    throw httpError(400, 'Pick a provider from the list');
  }
  if (!patient || patient.role !== 'patient' || patient.status !== 'active') {
    throw httpError(400, 'Patient account not found');
  }

  let replaced = null;
  if (replaceAppointmentId) {
    // Freed first, so the patient can move to a time that touches the old one.
    const r = await client.query(
      `UPDATE appointments SET status = 'cancelled'
       WHERE id = $1 AND patient_id = $2 AND status = 'booked' AND start_at > now()
       RETURNING id, patient_id, provider_id, appointment_type_id, start_at, end_at`,
      [replaceAppointmentId, patientId]
    );
    if (!r.rows[0]) throw httpError(409, 'This appointment can no longer be changed.');
    replaced = r.rows[0];
  }

  // The requested start must be one of the slots we'd offer right now:
  // inside the provider's hours, not blocked, not taken, not in the past.
  const day = (await client.query(
    `SELECT to_char($1::timestamptz AT TIME ZONE '${CLINIC_TZ}', 'YYYY-MM-DD') AS d`, [startAt]
  )).rows[0].d;
  const slots = await generateSlots({ appointmentTypeId, from: day, to: day, providerId }, client);
  const slot = slots.find((s) => new Date(s.start_at).getTime() === startAt.getTime());
  if (!slot) throw httpError(409, TAKEN);

  const endAt = new Date(startAt.getTime() + slot.duration_minutes * 60_000);
  if (await conflictCheck.hasConflict({ providerId, start: startAt, end: endAt }, client)) throw httpError(409, TAKEN);
  if (await conflictCheck.patientHasConflict({ patientId, start: startAt, end: endAt }, client)) {
    throw httpError(409, 'You already have an appointment at that time.');
  }

  const inserted = await client.query(
    `INSERT INTO appointments (patient_id, provider_id, appointment_type_id, start_at, end_at, booked_by, requires_sign_off)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id`,
    [patientId, providerId, appointmentTypeId, startAt, endAt, bookedBy, provider.role === 'physician_assistant']
  );
  const booked = {
    id: inserted.rows[0].id, date: slot.date, start_time: slot.start_time, end_time: slot.end_time,
    provider_name: slot.provider_name, start_at: startAt,
  };
  return { booked, replaced };
}

async function bookSlot(args) {
  const client = await db.pool.connect();
  let result;
  try {
    await client.query('BEGIN');
    result = await bookSlotWithClient(client, args);
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    throw err;
  } finally {
    client.release();
  }
  sendConfirmation(args.patientId, result.booked); // fire-and-forget: email trouble never undoes a booking
  return result.booked;
}

// Confirmation email (sprint log #357-358): date, time, location only.
async function sendConfirmation(patientId, booked) {
  try {
    const { rows } = await db.query('SELECT email FROM accounts WHERE id = $1', [patientId]);
    if (!rows[0]) return;
    const d = new Date(booked.start_at);
    await emailService.sendBookingConfirmation(rows[0].email, {
      date: d.toLocaleDateString('en-US', { timeZone: CLINIC_TZ, weekday: 'long', month: 'long', day: 'numeric' }),
      time: d.toLocaleTimeString('en-US', { timeZone: CLINIC_TZ, hour: 'numeric', minute: '2-digit' }),
      location: CLINIC_LOCATION,
    });
  } catch (err) {
    console.error('[booking] confirmation email failed for appointment', booked.id, err.message);
  }
}

module.exports = { bookSlot, bookSlotWithClient, sendConfirmation };
