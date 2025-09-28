// VoteRepository for Live Polling System
const Vote = require('../entity/voteEntity');

const create = async (voteData) => {
  const vote = new Vote(voteData);
  return await vote.save();
};

const findByPollAndUser = async (pollId, userId) => {
  return await Vote.findOne({ pollId, userId });
};

const findByPoll = async (pollId) => {
  return await Vote.find({ pollId });
};

const deleteByPollAndUser = async (pollId, userId) => {
  return await Vote.findOneAndDelete({ pollId, userId });
};

module.exports = {
  create,
  findByPollAndUser,
  findByPoll,
  deleteByPollAndUser
};