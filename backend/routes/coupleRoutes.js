// coupleRoutes.js
const express = require('express');
const router = express.Router();
const coupleController = require('../controllers/CoupleController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Create a new couple
router.post('/create', coupleController.createCouple);

// Authenticate couple
router.post('/authenticate', coupleController.authenticateCouple);

// Get couple details
router.get('/:coupleId', authenticateToken, coupleController.getCouple);

// Update couple status
router.put('/:coupleId/status', authenticateToken, coupleController.updateStatus);

// Reset status for new day (admin/automated use)
router.put('/:coupleId/reset-status', authenticateToken, coupleController.resetStatusForNewDay);

module.exports = router;