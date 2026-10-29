const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/requireRole');
const { ROLES } = require('../config/roles');

// Data Analysts only get de-identified data, through /reports (sprint log #230).
const NOT_ANALYST = ROLES.filter((role) => role !== 'data_analyst');

router.use('/auth', require('./auth.routes'));
router.use('/accounts', require('./accounts.routes'));
router.use('/availability', require('./availability.routes'));
router.use('/appointments', requireAuth, requireRole(...NOT_ANALYST), require('./appointments.routes'));
router.use('/schedules', requireAuth, requireRole(...NOT_ANALYST), require('./schedules.routes'));
router.use('/reports', require('./reports.routes'));

module.exports = router;
