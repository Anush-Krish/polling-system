// chatRoutes.js
const express = require('express');
const router = express.Router();
const ChatController = require('../controllers/ChatController');

module.exports = (io) => {
  const chatController = new ChatController(io);

  // Send a message
  router.post('/send', chatController.authenticateToken, chatController.sendMessage);

  // Get chat history
  router.get('/history/:coupleId', chatController.authenticateToken, chatController.getChatHistory);

  // Mark messages as read
  router.put('/read/:coupleId', chatController.authenticateToken, chatController.markMessagesAsRead);

  // Delete a message
  router.delete('/:messageId', chatController.authenticateToken, chatController.deleteMessage);

  return router;
};