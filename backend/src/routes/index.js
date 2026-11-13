const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/requireRole');
const { ROLES } = require('../config/roles');

// Data Analysts only get de-identified data, through /reports (sprint log #230).
const NOT_ANALYST = ROLES.filter((role) => role !== 'data_analyst');

router.use('/auth', require('./auth.routes'));
router.use('/links', require('./links.routes')); // reminder email links, no login
router.use('/accounts', require('./accounts.routes'));
router.use('/availability', require('./availability.routes'));
router.use('/appointments', requireAuth, requireRole(...NOT_ANALYST), require('./appointments.routes'));
router.use('/schedules', requireAuth, requireRole(...NOT_ANALYST), require('./schedules.routes'));
router.use('/reports', require('./reports.routes'));
// Reminder settings: the front desk (Receptionist) runs them; Process Manager keeps access.
router.use('/settings', requireAuth, requireRole('receptionist', 'process_manager'), require('./settings.routes'));
router.use('/waitlist', requireAuth, requireRole('patient'), require('./waitlist.routes'));

module.exports = router;
