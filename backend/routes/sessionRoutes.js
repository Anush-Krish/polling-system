// sessionRoutes.js
const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/SessionController');

// Create a new session
router.post('/create', sessionController.createSession);

// Verify session
router.post('/verify', sessionController.verifySession);

// Deactivate session (logout)
router.post('/deactivate', sessionController.deactivateSession);

// Clean expired sessions (admin/automated use)
router.delete('/expired', sessionController.cleanExpiredSessions);

module.exports = router;