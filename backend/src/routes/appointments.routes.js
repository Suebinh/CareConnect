const express = require('express');
const router = express.Router();
const controller = require('../controllers/appointments.controller');
const { requireAuth } = require('../middleware/auth');

// Search open slots by physician/date/specialty: sprint log tasks 304-308
router.get('/search', requireAuth, controller.searchOpenSlots);

// Patient's own upcoming appointments: sprint log tasks 327-330
router.get('/mine', requireAuth, controller.getMyAppointments);

// Book: sprint log tasks 310-314, 477-481 (Receptionist on patient's behalf)
router.post('/', requireAuth, controller.bookAppointment);

// Reschedule / cancel: sprint log tasks 321-324, 341-345, 482-486, 505-508
router.put('/:id/reschedule', requireAuth, controller.rescheduleAppointment);
router.put('/:id/cancel', requireAuth, controller.cancelAppointment);

// Status (completed/no-show/cancelled): sprint log tasks 94-97, 436-439
router.put('/:id/status', requireAuth, controller.updateStatus);

// Sign-off for PA-led visits: sprint log tasks 274-277, 441-444
router.put('/:id/sign-off', requireAuth, controller.signOff);

// Visit notes: sprint log tasks 214-218
router.post('/:id/notes', requireAuth, controller.addVisitNote);
router.get('/:id/notes', requireAuth, controller.getVisitNotes);

module.exports = router;
