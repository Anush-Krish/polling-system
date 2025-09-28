// PollDTO for Live Polling System
class PollDTO {
  constructor(question, options, creatorId) {
    this.question = question;
    this.options = options;
    this.creatorId = creatorId;
    this.createdAt = new Date();
  }

  // Method to validate the poll data
  static validate(pollData) {
    const errors = [];

    if (!pollData.question || pollData.question.trim().length === 0) {
      errors.push('Question is required');
    }

    if (!pollData.options || !Array.isArray(pollData.options) || pollData.options.length < 2) {
      errors.push('At least two options are required');
    }

    if (pollData.options && Array.isArray(pollData.options)) {
      pollData.options.forEach((option, index) => {
        if (!option.text || option.text.trim().length === 0) {
          errors.push(`Option ${index + 1} text is required`);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Method to sanitize the poll data
  static sanitize(pollData) {
    return {
      question: pollData.question ? pollData.question.trim() : '',
      options: pollData.options ? pollData.options.map((option, index) => ({
        id: index + 1,
        text: option.text ? option.text.trim() : '',
        votes: option.votes || 0
      })) : [],
      creatorId: pollData.creatorId || null
    };
  }
}

module.exports = PollDTO;