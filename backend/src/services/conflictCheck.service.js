// Rejects overlapping bookings at write-time. Used by
// appointments.controller.bookAppointment (and rescheduleAppointment later)
// (sprint log #77-78, #312, #480, #497-498).
//
// Must run inside the same DB transaction as the insert/update, after the
// caller has locked the provider row (SELECT ... FOR UPDATE), so two
// patients booking the same slot at once are serialized and the second one
// sees the first one's row (sprint log #80, #314, #500).
//
// NOTE: minimal version written so online booking could ship; tasks #77-78
// are assigned to ssamuelduarte, who should review or extend it.

const db = require('../config/db');

// Overlap = existing.start < new.end AND existing.end > new.start
// (back-to-back appointments, e.g. 9:00-9:30 then 9:30-10:00, are fine).
async function hasConflict({ providerId, start, end, excludeAppointmentId = null }, client = db) {
  const result = await client.query(
    `SELECT 1 FROM appointments
     WHERE provider_id = $1 AND status <> 'cancelled'
       AND start_at < $3 AND end_at > $2
       AND ($4::int IS NULL OR id <> $4)
     LIMIT 1`,
    [providerId, start, end, excludeAppointmentId]
  );
  return result.rowCount > 0;
}

// The patient can't be in two places at once either.
async function patientHasConflict({ patientId, start, end, excludeAppointmentId = null }, client = db) {
  const result = await client.query(
    `SELECT 1 FROM appointments
     WHERE patient_id = $1 AND status <> 'cancelled'
       AND start_at < $3 AND end_at > $2
       AND ($4::int IS NULL OR id <> $4)
     LIMIT 1`,
    [patientId, start, end, excludeAppointmentId]
  );
  return result.rowCount > 0;
}

module.exports = { hasConflict, patientHasConflict };
