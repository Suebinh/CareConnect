// Query via require('../config/db').query(text, params).
// `delivery_status` is one of: pending | sent | failed — polled by
// jobs/reminderJob.js and surfaced on the Process Manager's status page.

async function queueForAppointment(appointmentId, sendAt) {
  // TODO: INSERT INTO reminders (appointment_id, send_at, delivery_status) VALUES ($1, $2, 'pending')
  throw new Error('Not implemented: reminder.model.queueForAppointment');
}

async function findDue(now) {
  // TODO: SELECT * FROM reminders WHERE send_at <= $1 AND delivery_status = 'pending'
  throw new Error('Not implemented: reminder.model.findDue');
}

async function markDelivered(id, status) {
  // TODO: UPDATE reminders SET delivery_status = $2 WHERE id = $1
  throw new Error('Not implemented: reminder.model.markDelivered');
}

module.exports = { queueForAppointment, findDue, markDelivered };
