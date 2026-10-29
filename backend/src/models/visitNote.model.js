// Query via require('../config/db').query(text, params).
// Never exposed to the Patient role (sprint log #217-218).

async function add(appointmentId, { authorId, note }) {
  // TODO: INSERT INTO visit_notes (appointment_id, author_id, note, created_at) VALUES (...)
  throw new Error('Not implemented: visitNote.model.add');
}

async function findByAppointment(appointmentId) {
  // TODO: SELECT * FROM visit_notes WHERE appointment_id = $1 ORDER BY created_at
  throw new Error('Not implemented: visitNote.model.findByAppointment');
}

module.exports = { add, findByAppointment };
