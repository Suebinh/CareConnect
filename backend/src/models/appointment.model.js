const db = require('../config/db');
const { CLINIC_TZ } = require('../config/clinic');

//
// `status` is one of: booked | completed | no_show | cancelled.
// `booked_by` is one of: patient | receptionist.
// `requires_sign_off` / `signed_off_at` support the PA-co-sign workflow.

async function findOpenSlots({ providerId, date, specialty }) {
  // TODO: filter open time slots, excluding blocked_time and already-booked
  // appointments (sprint log #305-307)
  throw new Error('Not implemented: appointment.model.findOpenSlots');
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

async function create(data) {
  // TODO: INSERT INTO appointments (...) VALUES (...) — call
  // services/conflictCheck.service.js first
  throw new Error('Not implemented: appointment.model.create');
}

async function reschedule(id, { newStart, newEnd }) {
  // TODO: UPDATE appointments SET start_time = $2, end_time = $3 WHERE id = $1
  throw new Error('Not implemented: appointment.model.reschedule');
}

async function updateStatus(id, status) {
  // TODO: UPDATE appointments SET status = $2 WHERE id = $1
  throw new Error('Not implemented: appointment.model.updateStatus');
}

async function signOff(id, signedOffBy) {
  // TODO: UPDATE appointments SET signed_off_at = now(), signed_off_by = $2 WHERE id = $1
  throw new Error('Not implemented: appointment.model.signOff');
}

module.exports = {
  findOpenSlots,
  findByPatient,
  findByProviderAndDate,
  create,
  reschedule,
  updateStatus,
  signOff,
};
