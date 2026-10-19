const express = require('express');
const router = express.Router();
const controller = require('../controllers/accounts.controller');
const { requireAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/requireRole');

// Profile: sprint log tasks 266-268
router.get('/me', requireAuth, controller.getProfile);
router.put('/me', requireAuth, controller.updateProfile);

// Staff account management (Process Manager): sprint log tasks 366-368
router.get('/', requireAuth, requireRole('process_manager'), controller.listStaff);
router.put('/:id/status', requireAuth, requireRole('process_manager'), controller.updateStaffStatus);

module.exports = router;
