// Query via require('../config/db').query(text, params).
//
// Covers recurring weekly rules, one-off blocked time, and per-type
// appointment durations — see db/migrations/001_init.sql.

async function getRecurringRules(providerId) {
  // TODO: SELECT * FROM availability_rules WHERE provider_id = $1
  throw new Error('Not implemented: availability.model.getRecurringRules');
}

async function setRecurringRules(providerId, rules) {
  // TODO: replace availability_rules rows for this provider
  throw new Error('Not implemented: availability.model.setRecurringRules');
}

async function addBlockedTime(providerId, { start, end, reason }) {
  // TODO: INSERT INTO blocked_time (...) VALUES (...)
  throw new Error('Not implemented: availability.model.addBlockedTime');
}

async function getBlockedTime(providerId, { from, to }) {
  // TODO: SELECT * FROM blocked_time WHERE provider_id = $1 AND ...
  throw new Error('Not implemented: availability.model.getBlockedTime');
}

async function setAppointmentDurations(providerId, durationsByType) {
  // TODO: UPSERT INTO appointment_type_durations (...) VALUES (...)
  throw new Error('Not implemented: availability.model.setAppointmentDurations');
}

module.exports = {
  getRecurringRules,
  setRecurringRules,
  addBlockedTime,
  getBlockedTime,
  setAppointmentDurations,
};
