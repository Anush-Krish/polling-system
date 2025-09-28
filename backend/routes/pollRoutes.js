const express = require('express');
const router = express.Router();
const pollController = require('../controllers/pollController');
const { authenticateToken } = require('../middleware/auth');

// Create a new poll (requires authentication - for teachers)
router.post('/', authenticateToken, pollController.createPoll);

// Get all polls
router.get('/', pollController.getAllPolls);

// Get a specific poll by ID
router.get('/:id', pollController.getPollById);

// Update a poll (requires authentication)
router.put('/:id', authenticateToken, pollController.updatePoll);

// Delete a poll (requires authentication)
router.delete('/:id', authenticateToken, pollController.deletePoll);

// Vote on a poll (no authentication required - for students)
router.post('/:id/vote', pollController.voteOnPoll);

// Add a participant to a poll (no authentication required - for students)
router.post('/:id/participate', pollController.addParticipant);

// Remove a participant from a poll (requires authentication - for teachers)
router.delete('/:id/participant/:participantId', authenticateToken, pollController.removeParticipant);

// End a poll (requires authentication - for teachers)
router.put('/:id/end', authenticateToken, pollController.endPoll);

module.exports = router;