const express = require('express');
const router = express.Router();
const controller = require('../controllers/waitlist.controller');

// Patient-only (enforced in routes/index.js). Every query is scoped to the
// logged-in patient, so nobody can see or change another patient's entries.
router.get('/options', controller.getOptions);
router.get('/mine', controller.getMine);
router.post('/', controller.join);
router.delete('/:id', controller.leave);

module.exports = router;
