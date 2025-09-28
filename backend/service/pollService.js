// PollService for Live Polling System
const pollRepository = require('../repository/pollRepository');
const voteRepository = require('../repository/voteRepository');
const User = require('../entity/userEntity');
const PollDTO = require('../dto/pollDTO');
const voteService = require('./voteService');

const createPoll = async (pollData, userId) => {
  // Validate the input data
  const validation = PollDTO.validate(pollData);
  if (!validation.isValid) {
    throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
  }

  // Sanitize the input data
  const sanitizedData = PollDTO.sanitize(pollData);

  // Create a new poll entity
  const poll = {
    question: sanitizedData.question,
    options: sanitizedData.options,
    creatorId: userId
  };

  // Save to database
  const savedPoll = await pollRepository.create(poll);
  
  // Add poll to user's created polls
  await User.findByIdAndUpdate(userId, {
    $push: { pollsCreated: savedPoll._id }
  });
  
  return savedPoll;
};

const getAllPolls = async () => {
  try {
    return await pollRepository.findActivePolls();
  } catch (error) {
    throw new Error(`Error retrieving polls: ${error.message}`);
  }
};

const getPollById = async (id) => {
  try {
    const poll = await pollRepository.findById(id);
    if (!poll) {
      throw new Error('Poll not found');
    }

    // Reset vote counts to 0 to avoid double counting
    poll.options.forEach(option => {
      option.votes = 0;
    });

    // Update vote counts from vote repository
    const votes = await voteRepository.findByPoll(id);
    votes.forEach(vote => {
      if (poll.options[vote.optionIndex]) {
        poll.options[vote.optionIndex].votes += 1;
      }
    });

    return poll;
  } catch (error) {
    throw new Error(`Error retrieving poll: ${error.message}`);
  }
};

const updatePoll = async (id, updateData, userId) => {
  try {
    // Check if the user is the creator of the poll
    const poll = await pollRepository.findById(id);
    if (!poll) {
      throw new Error('Poll not found');
    }
    
    if (poll.creatorId.toString() !== userId) {
      throw new Error('Not authorized to update this poll');
    }
    
    // Update the poll
    return await pollRepository.updateById(id, updateData);
  } catch (error) {
    throw new Error(`Error updating poll: ${error.message}`);
  }
};

const deletePoll = async (id, userId) => {
  try {
    // Check if the user is the creator of the poll
    const poll = await pollRepository.findById(id);
    if (!poll) {
      return null;
    }
    
    if (poll.creatorId.toString() !== userId) {
      throw new Error('Not authorized to delete this poll');
    }
    
    // Delete the poll
    return await pollRepository.deleteById(id);
  } catch (error) {
    throw new Error(`Error deleting poll: ${error.message}`);
  }
};

const voteOnPoll = async (pollId, optionIndex, userId) => {
  try {
    const poll = await pollRepository.findById(pollId);
    if (!poll) {
      throw new Error('Poll not found');
    }

    if (optionIndex < 0 || optionIndex >= poll.options.length) {
      throw new Error('Invalid option index');
    }

    // For the socket-based system, we'll allow multiple votes per session
    // In a real system, you might want to track by socket ID or session ID
    // Increment the vote count for the selected option in the poll
    poll.options[optionIndex].votes += 1;
    
    const updatedPoll = await poll.save();
    
    // If userId is provided (for traditional API calls), add to user's participated polls
    if (userId) {
      await User.findByIdAndUpdate(userId, {
        $push: { pollsParticipated: updatedPoll._id }
      });
    }
    
    return updatedPoll;
  } catch (error) {
    throw new Error(`Error voting on poll: ${error.message}`);
  }
};

const addParticipant = async (pollId, participantName, socketId = null) => {
  try {
    const poll = await pollRepository.findById(pollId);
    if (!poll) {
      throw new Error('Poll not found');
    }

    // Add participant to the poll
    if (!poll.participants) {
      poll.participants = [];
    }
    
    // Check if participant already exists
    const existingParticipant = poll.participants.find(p => p.name === participantName);
    if (existingParticipant) {
      throw new Error('Participant with this name already exists');
    }
    
    // Add new participant
    poll.participants.push({
      name: participantName,
      socketId: socketId || null,
      joinedAt: new Date()
    });
    
    const updatedPoll = await poll.save();
    return updatedPoll;
  } catch (error) {
    throw new Error(`Error adding participant to poll: ${error.message}`);
  }
};

const removeParticipant = async (pollId, participantId) => {
  try {
    const poll = await pollRepository.findById(pollId);
    if (!poll) {
      throw new Error('Poll not found');
    }

    // Remove participant from the poll
    poll.participants = poll.participants.filter(p => p._id.toString() !== participantId);
    
    const updatedPoll = await poll.save();
    return updatedPoll;
  } catch (error) {
    throw new Error(`Error removing participant from poll: ${error.message}`);
  }
};

const endPoll = async (pollId, userId) => {
  try {
    // Check if the user is the creator of the poll
    const poll = await pollRepository.findById(pollId);
    if (!poll) {
      throw new Error('Poll not found');
    }
    
    if (poll.creatorId.toString() !== userId) {
      throw new Error('Not authorized to end this poll');
    }
    
    // Update poll to be inactive
    return await pollRepository.updateById(pollId, { isActive: false });
  } catch (error) {
    throw new Error(`Error ending poll: ${error.message}`);
  }
};

module.exports = {
  createPoll,
  getAllPolls,
  getPollById,
  updatePoll,
  deletePoll,
  voteOnPoll,
  addParticipant,
  removeParticipant,
  endPoll
};