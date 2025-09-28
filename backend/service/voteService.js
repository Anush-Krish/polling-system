// VoteService for Live Polling System
const voteRepository = require('../repository/voteRepository');
const pollRepository = require('../repository/pollRepository');
const userRepository = require('../repository/userRepository');
const VoteDTO = require('../dto/voteDTO');

const createVote = async (voteData) => {
  // Validate the input data
  const validation = VoteDTO.validate(voteData);
  if (!validation.isValid) {
    throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
  }

  // Sanitize the input data
  const sanitizedData = VoteDTO.sanitize(voteData);

  // Check if user has already voted on this poll
  const existingVote = await voteRepository.findByPollAndUser(
    sanitizedData.pollId,
    sanitizedData.userId
  );
  if (existingVote) {
    throw new Error('User has already voted on this poll');
  }

  // Create new vote
  return await voteRepository.create(sanitizedData);
};

const getVotesByPoll = async (pollId) => {
  return await voteRepository.findByPoll(pollId);
};

module.exports = {
  createVote,
  getVotesByPoll
};