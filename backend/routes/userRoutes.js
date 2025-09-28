const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');

// Register a new user
router.post('/register', userController.register);

// Login a user
router.post('/login', userController.login);

// Get user profile (requires authentication)
router.get('/profile', authenticateToken, userController.getProfile);

// Update user profile (requires authentication)
router.put('/profile', authenticateToken, userController.updateProfile);

module.exports = router;