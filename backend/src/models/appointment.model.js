const db = require('../config/db');
const { CLINIC_TZ } = require('../config/clinic');

//
// `status` is one of: booked | completed | no_show | cancelled.
// `booked_by` is one of: patient | receptionist.
// `requires_sign_off` / `signed_off_at` support the PA-co-sign workflow.

// Choices for booking/waitlist forms: bookable providers, appointment types,
// and the specialties those providers cover. No patient data.
async function findOptions() {
  const providers = await db.query(
    `SELECT id, name, role, specialty FROM accounts
     WHERE role IN ('physician', 'physician_assistant') AND status = 'active'
     ORDER BY name`
  );
  const types = await db.query('SELECT id, name FROM appointment_types ORDER BY name');
  const specialties = [...new Set(providers.rows.map((p) => p.specialty).filter(Boolean))].sort();
  return { providers: providers.rows, appointmentTypes: types.rows, specialties };
}

// A patient's upcoming (not yet started, not cancelled) appointments, soonest first.
// patientId must always come from the session, never a URL param (CLAUDE.md HIPAA note).
// Scheduling details only: no visit notes, no other patients.
async function findByPatient(patientId) {
  const result = await db.query(
    `SELECT a.id,
            to_char(a.start_at AT TIME ZONE '${CLINIC_TZ}', 'YYYY-MM-DD') AS date,
            to_char(a.start_at AT TIME ZONE '${CLINIC_TZ}', 'HH24:MI') AS start_time,
            to_char(a.end_at AT TIME ZONE '${CLINIC_TZ}', 'HH24:MI') AS end_time,
            a.status,
            t.name AS appointment_type,
            prov.name AS provider_name,
            prov.role AS provider_role,
            prov.specialty AS provider_specialty
     FROM appointments a
     JOIN accounts prov ON prov.id = a.provider_id
     JOIN appointment_types t ON t.id = a.appointment_type_id
     WHERE a.patient_id = $1
       AND a.status = 'booked'
       AND a.start_at >= now()
     ORDER BY a.start_at`,
    [patientId]
  );
  return result.rows;
}

async function findByProviderAndDate(providerId, date) {
  // TODO: SELECT * FROM appointments WHERE provider_id = $1 AND date = $2
  throw new Error('Not implemented: appointment.model.findByProviderAndDate');
}

async function reschedule(id, { newStart, newEnd }) {
  // TODO: UPDATE appointments SET start_time = $2, end_time = $3 WHERE id = $1
  throw new Error('Not implemented: appointment.model.reschedule');
}

async function updateStatus(id, status) {
  // TODO: UPDATE appointments SET status = $2 WHERE id = $1
  throw new Error('Not implemented: appointment.model.updateStatus');
}

// Cancel a future booked appointment in one atomic UPDATE, so two cancels
// (or a cancel racing a status change) can't both succeed. Pass patientId to
// limit it to that patient's own appointment (HIPAA: a patient can never
// touch someone else's). Returns the cancelled row, or null if nothing matched.
async function cancel(id, { patientId = null } = {}) {
  const result = await db.query(
    `UPDATE appointments SET status = 'cancelled'
     WHERE id = $1
       AND status = 'booked'
       AND start_at > now()
       AND ($2::int IS NULL OR patient_id = $2)
     RETURNING id, patient_id, provider_id, appointment_type_id, start_at, end_at`,
    [id, patientId]
  );
  return result.rows[0] || null;
}

// Receptionist check-in. Only today's (clinic time zone) booked, not-yet-
// checked-in appointments. Returns the updated row, or null if it didn't qualify.
async function checkIn(id, receptionistId) {
  const result = await db.query(
    `UPDATE appointments SET checked_in_at = now(), checked_in_by = $2
     WHERE id = $1
       AND status = 'booked'
       AND checked_in_at IS NULL
       AND (start_at AT TIME ZONE '${CLINIC_TZ}')::date = (now() AT TIME ZONE '${CLINIC_TZ}')::date
     RETURNING id, to_char(checked_in_at AT TIME ZONE '${CLINIC_TZ}', 'HH24:MI') AS checked_in_time`,
    [id, receptionistId]
  );
  return result.rows[0] || null;
}

// Undo a mistaken check-in (wrong patient clicked). Only while still 'booked'.
async function undoCheckIn(id) {
  const result = await db.query(
    `UPDATE appointments SET checked_in_at = NULL, checked_in_by = NULL
     WHERE id = $1 AND status = 'booked' AND checked_in_at IS NOT NULL
     RETURNING id`,
    [id]
  );
  return result.rows[0] || null;
}

async function signOff(id, signedOffBy) {
  // TODO: UPDATE appointments SET signed_off_at = now(), signed_off_by = $2 WHERE id = $1
  throw new Error('Not implemented: appointment.model.signOff');
}

module.exports = {
  findOptions,
  findByPatient,
  findByProviderAndDate,
  reschedule,
  updateStatus,
  cancel,
  checkIn,
  undoCheckIn,
  signOff,
};
