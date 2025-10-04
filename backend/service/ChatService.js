// ChatService.js
const ChatMessage = require('../entity/ChatMessage');
const Couple = require('../entity/Couple');
const ChatMessageDTO = require('../dto/ChatMessageDTO');

class ChatService {
  // Send a new message
  async sendMessage(messageData) {
    try {
      // Validate input data using DTO
      const validatedData = ChatMessageDTO.create(messageData);
      
      // Check if couple exists and is active
      const couple = await Couple.findById(messageData.coupleId);
      if (!couple || !couple.isActive) {
        throw new Error('Couple not found or inactive');
      }
      
      // Check if the sender is one of the partners
      if (couple.partner1 !== messageData.sender && couple.partner2 !== messageData.sender) {
        throw new Error('Unauthorized: Not a partner in this couple');
      }
      
      const message = new ChatMessage(validatedData.toObject());
      await message.save();
      
      return message;
    } catch (error) {
      throw new Error(`Failed to send message: ${error.message}`);
    }
  }

  // Get chat history for a couple
  async getChatHistory(coupleId, limit = 50) {
    try {
      // Check if couple exists and is active
      const couple = await Couple.findById(coupleId);
      if (!couple || !couple.isActive) {
        throw new Error('Couple not found or inactive');
      }
      
      // Get chat messages for the couple, sorted by timestamp (newest last, for chronological order)
      const messages = await ChatMessage.find({
        coupleId,
        isActive: true
      }).sort({ timestamp: 1 }).limit(limit);
      
      return messages;
    } catch (error) {
      throw new Error(`Failed to get chat history: ${error.message}`);
    }
  }

  // Mark messages as read (not implemented in this basic version)
  async markMessagesAsRead(coupleId, sender) {
    try {
      // Check if couple exists and is active
      const couple = await Couple.findById(coupleId);
      if (!couple || !couple.isActive) {
        throw new Error('Couple not found or inactive');
      }
      
      // Update messages where the sender is not the current user (for read receipts)
      await ChatMessage.updateMany(
        { 
          coupleId, 
          sender: { $ne: sender },
          read: false 
        },
        { read: true }
      );
      
      return { message: 'Messages marked as read successfully' };
    } catch (error) {
      throw new Error(`Failed to mark messages as read: ${error.message}`);
    }
  }

  // Delete a message (only by the sender)
  async deleteMessage(messageId, sender) {
    try {
      // Find the message
      const message = await ChatMessage.findById(messageId);
      if (!message || !message.isActive) {
        throw new Error('Message not found');
      }
      
      // Check if couple exists and is active
      const couple = await Couple.findById(message.coupleId);
      if (!couple || !couple.isActive) {
        throw new Error('Couple not found or inactive');
      }
      
      // Check if the user is the one who sent it
      if (message.sender !== sender) {
        throw new Error('Unauthorized: Only the sender can delete this message');
      }
      
      // Soft delete the message
      const updatedMessage = await ChatMessage.findByIdAndUpdate(
        messageId,
        { isActive: false },
        { new: true }
      );
      
      return updatedMessage;
    } catch (error) {
      throw new Error(`Failed to delete message: ${error.message}`);
    }
  }
}

module.exports = new ChatService();