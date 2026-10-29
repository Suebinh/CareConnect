// Query via require('../config/db').query(text, params).
//
// `status` is one of: booked | completed | no_show | cancelled.
// `booked_by` is one of: patient | receptionist.
// `requires_sign_off` / `signed_off_at` support the PA-co-sign workflow.

async function findOpenSlots({ providerId, date, specialty }) {
  // TODO: filter open time slots, excluding blocked_time and already-booked
  // appointments (sprint log #305-307)
  throw new Error('Not implemented: appointment.model.findOpenSlots');
}

async function findByPatient(patientId) {
  // TODO: SELECT * FROM appointments WHERE patient_id = $1 — always scope
  // to the session's patient id, never a URL param (CLAUDE.md HIPAA note)
  throw new Error('Not implemented: appointment.model.findByPatient');
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
