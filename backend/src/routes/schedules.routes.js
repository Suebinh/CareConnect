const express = require('express');
const router = express.Router();
const controller = require('../controllers/schedules.controller');
const { requireAuth } = require('../middleware/auth');

// Daily schedule for a single provider: sprint log tasks 87-91, 427-430
router.get('/daily/:providerId', requireAuth, controller.getDailySchedule);

// Combined schedule of staff a Physician supervises: sprint log tasks 104-107
// Daily schedules of providers a Nurse supports: sprint log tasks 207-212
router.get('/supervised', requireAuth, controller.getSupervisedSchedule);

// Clinic-wide master schedule (Receptionist): sprint log tasks 473-476, 492-495
router.get('/clinic', requireAuth, controller.getClinicSchedule);

module.exports = router;
