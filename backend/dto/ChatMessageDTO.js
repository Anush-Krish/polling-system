// ChatMessageDTO.js
class ChatMessageDTO {
  constructor(data) {
    this.coupleId = data.coupleId;
    this.sender = data.sender;
    this.content = data.content;
  }

  static create(data) {
    // Input validation
    if (!data.coupleId) {
      throw new Error('Couple ID is required');
    }
    
    if (!data.sender || typeof data.sender !== 'string' || data.sender.trim().length === 0) {
      throw new Error('Sender is required and must be a non-empty string');
    }
    
    if (!data.content || typeof data.content !== 'string' || data.content.trim().length === 0) {
      throw new Error('Content is required and must be a non-empty string');
    }
    
    if (data.content.trim().length > 500) {
      throw new Error('Content must not exceed 500 characters');
    }
    
    return new ChatMessageDTO(data);
  }

  // Convert to plain object for database operations
  toObject() {
    return {
      coupleId: this.coupleId,
      sender: this.sender,
      content: this.content
    };
  }
}

module.exports = ChatMessageDTO;