const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth.controller');

// Sprint log tasks 280-284, 61-64, 452-459, 195-200, 460-466
router.post('/register', controller.register);
router.post('/login', controller.login);
router.post('/logout', controller.logout);
router.post('/forgot-password', controller.forgotPassword);
router.post('/reset-password', controller.resetPassword);

module.exports = router;
