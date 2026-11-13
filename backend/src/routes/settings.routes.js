const express = require('express');
const router = express.Router();
const controller = require('../controllers/settings.controller');

// Receptionist or Process Manager (enforced in routes/index.js).
// Reminder on/off + timing: sprint log #395-397. Status: #374-376.
router.get('/reminders', controller.getReminders);
router.put('/reminders', controller.updateReminders);
router.post('/reminders/run', controller.runRemindersNow);
router.get('/reminders/preview', controller.previewReminder);

module.exports = router;
