// TODO: fetch one provider's appointments for a given day (sprint log #88, #428)
async function getDailySchedule(req, res, next) {
  res.status(501).json({ error: 'Not implemented: getDailySchedule' });
}

// TODO: Physician -> fetch schedules of supervised PAs/Nurses (sprint log #105);
// Nurse -> fetch schedules of supported Physicians/PAs (sprint log #209);
// scope strictly to staff req.user actually supervises/supports (sprint log #211).
async function getSupervisedSchedule(req, res, next) {
  res.status(501).json({ error: 'Not implemented: getSupervisedSchedule' });
}

// TODO: pull daily appointment traffic across every provider, Receptionist
// view (sprint log #473-474, #493)
async function getClinicSchedule(req, res, next) {
  res.status(501).json({ error: 'Not implemented: getClinicSchedule' });
}

module.exports = { getDailySchedule, getSupervisedSchedule, getClinicSchedule };
