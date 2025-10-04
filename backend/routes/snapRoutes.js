// snapRoutes.js
const express = require('express');
const router = express.Router();
const snapController = require('../controllers/SnapController');

// Upload a new snap
router.post('/upload', snapController.authenticateToken, snapController.uploadSnap);

// Get snaps for a couple
router.get('/couple/:coupleId', snapController.authenticateToken, snapController.getSnaps);

// Get today's snaps for a couple
router.get('/today/couple/:coupleId', snapController.authenticateToken, snapController.getTodaysSnaps);

// Delete a snap
router.delete('/:snapId', snapController.authenticateToken, snapController.deleteSnap);

module.exports = router;