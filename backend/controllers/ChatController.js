// ChatController.js
const ChatService = require('../service/ChatService');
const { authenticateToken } = require('../middleware/authMiddleware');

class ChatController {
  // Send a new message
  async sendMessage(req, res) {
    try {
      const { coupleId, sender, content } = req.body;

      const message = await ChatService.sendMessage({
        coupleId,
        sender,
        content
      });

      res.status(201).json({
        success: true,
        message: 'Message sent successfully',
        data: {
          _id: message._id,
          coupleId: message.coupleId,
          sender: message.sender,
          content: message.content,
          timestamp: message.timestamp
        }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get chat history
  async getChatHistory(req, res) {
    try {
      const { coupleId } = req.params;
      const { limit = 50 } = req.query;

      const messages = await ChatService.getChatHistory(coupleId, parseInt(limit));

      res.status(200).json({
        success: true,
        data: messages
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  // Mark messages as read
  async markMessagesAsRead(req, res) {
    try {
      const { coupleId } = req.params;
      const { sender } = req.body;

      await ChatService.markMessagesAsRead(coupleId, sender);

      res.status(200).json({
        success: true,
        message: 'Messages marked as read successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Delete a message
  async deleteMessage(req, res) {
    try {
      const { messageId } = req.params;
      const { sender } = req.body;

      const deletedMessage = await ChatService.deleteMessage(messageId, sender);

      res.status(200).json({
        success: true,
        message: 'Message deleted successfully',
        data: deletedMessage
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
  
  // Middleware to apply authentication
  get authenticateToken() {
    return authenticateToken;
  }
}

module.exports = new ChatController();