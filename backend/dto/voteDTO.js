// VoteDTO for Live Polling System
class VoteDTO {
  constructor(pollId, optionIndex, userId) {
    this.pollId = pollId;
    this.optionIndex = optionIndex;
    this.userId = userId;
  }

  // Method to validate the vote data
  static validate(voteData) {
    const errors = [];

    if (!voteData.pollId) {
      errors.push('Poll ID is required');
    }

    if (voteData.optionIndex === undefined || voteData.optionIndex === null) {
      errors.push('Option index is required');
    } else if (typeof voteData.optionIndex !== 'number' || voteData.optionIndex < 0) {
      errors.push('Option index must be a non-negative number');
    }

    if (!voteData.userId) {
      errors.push('User ID is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Method to sanitize the vote data
  static sanitize(voteData) {
    return {
      pollId: voteData.pollId,
      optionIndex: parseInt(voteData.optionIndex),
      userId: voteData.userId
    };
  }
}

module.exports = VoteDTO;