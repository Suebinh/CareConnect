const express = require('express');
const router = express.Router();
const controller = require('../controllers/reports.controller');
const { requireAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/requireRole');

// All reporting is Data Analyst-only and reads from de-identified views —
// see services/deidentify.service.js. Sprint log tasks 253-256, 248-251,
// 243-246, 238-241, 233-236.
router.use(requireAuth, requireRole('data_analyst'));

router.get('/appointments-per-week', controller.appointmentsPerWeek);
router.get('/no-show-rate', controller.noShowRate);
router.get('/raw-data', controller.rawAppointmentData);
router.get('/survey-results', controller.surveyResults);
router.get('/export', controller.exportReport);

module.exports = router;
