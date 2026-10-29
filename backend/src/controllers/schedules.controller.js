const scheduleModel = require('../models/schedule.model');
const { todayInClinic } = require('../config/clinic');
const { isValidDate } = require('../utils/validate');

// TODO: fetch one provider's appointments for a given day (sprint log #88, #428)
async function getDailySchedule(req, res, next) {
  res.status(501).json({ error: 'Not implemented: getDailySchedule' });
}

// Nurse -> Physicians/PAs they support (#207, #209, #211).
// Physician -> PAs/Nurses they supervise (#105). `providers` lists those staff.
// GET /api/schedules/supervised?date=YYYY-MM-DD (defaults to today)
async function getSupervisedSchedule(req, res, next) {
  try {
    if (!scheduleModel.SUPPORTED_ROLES.includes(req.user.role)) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    const date = req.query.date || todayInClinic();
    if (!isValidDate(date)) return res.status(400).json({ error: 'date must be YYYY-MM-DD' });

    const { providers, appointments } =
      await scheduleModel.findRelatedSchedule(req.user.role, req.user.id, date);
    res.json({ date, providers, appointments });
  } catch (err) { next(err); }
}

// TODO: Receptionist clinic-wide view (sprint log #473-474, #493)
async function getClinicSchedule(req, res, next) {
  res.status(501).json({ error: 'Not implemented: getClinicSchedule' });
}

module.exports = { getDailySchedule, getSupervisedSchedule, getClinicSchedule };
