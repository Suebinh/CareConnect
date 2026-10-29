// TODO: fetch recurring rules + blocked time for a provider (sprint log #416)
async function getAvailability(req, res, next) {
  res.status(501).json({ error: 'Not implemented: getAvailability' });
}

// TODO: save recurring weekly rules, regenerate bookable slots via
// services/slotGenerator.service.js (sprint log #73-74, #418-419)
async function setRecurringAvailability(req, res, next) {
  res.status(501).json({ error: 'Not implemented: setRecurringAvailability' });
}

// TODO: save blocked time range, exclude it from availability (sprint log #271)
async function blockTime(req, res, next) {
  res.status(501).json({ error: 'Not implemented: blockTime' });
}

// TODO: save per-appointment-type duration settings (sprint log #120)
async function setAppointmentDurations(req, res, next) {
  res.status(501).json({ error: 'Not implemented: setAppointmentDurations' });
}

module.exports = {
  getAvailability,
  setRecurringAvailability,
  blockTime,
  setAppointmentDurations,
};
