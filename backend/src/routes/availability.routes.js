const express = require('express');
const router = express.Router();
const controller = require('../controllers/availability.controller');
const { requireAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/requireRole');

const PROVIDER_ROLES = ['physician', 'physician_assistant', 'nurse'];

// Recurring weekly availability: sprint log tasks 71-75, 416-420
router.get('/:providerId', requireAuth, controller.getAvailability);
router.put('/:providerId', requireAuth, requireRole(...PROVIDER_ROLES), controller.setRecurringAvailability);

// Block time off (vacations/sick days/meetings): sprint log tasks 270-272
router.post('/:providerId/block', requireAuth, requireRole(...PROVIDER_ROLES), controller.blockTime);

// Appointment-type durations: sprint log tasks 118-121
router.put('/:providerId/appointment-types', requireAuth, requireRole(...PROVIDER_ROLES), controller.setAppointmentDurations);

module.exports = router;
