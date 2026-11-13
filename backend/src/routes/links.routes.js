const express = require('express');
const router = express.Router();
const controller = require('../controllers/links.controller');

// No login: the unguessable token (or signed id) in the email link is the key.
// Only POSTs change anything, so link-scanners that GET every URL can't.
router.get('/appointment/:token', controller.getAppointment);
router.get('/appointment/:token/slots', controller.slots);
router.post('/appointment/:token/confirm', controller.confirm);
router.post('/appointment/:token/cancel', controller.cancel);
router.post('/appointment/:token/reschedule', controller.reschedule);
router.post('/stop-reminders', controller.stopReminders);

module.exports = router;
