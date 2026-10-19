const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth.routes'));
router.use('/accounts', require('./accounts.routes'));
router.use('/availability', require('./availability.routes'));
router.use('/appointments', require('./appointments.routes'));
router.use('/schedules', require('./schedules.routes'));
router.use('/reports', require('./reports.routes'));

module.exports = router;
