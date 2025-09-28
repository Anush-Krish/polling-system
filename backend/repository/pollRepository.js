// PollRepository for Live Polling System
const Poll = require('../entity/pollEntity');

const create = async (pollData) => {
  const poll = new Poll(pollData);
  return await poll.save();
};

const findById = async (id) => {
  return await Poll.findById(id).populate('creatorId', 'name email');
};

const findAll = async (filters = {}, options = {}) => {
  return await Poll.find(filters, null, options)
    .populate('creatorId', 'name email')
    .sort({ createdAt: -1 });
};

const updateById = async (id, updateData) => {
  return await Poll.findByIdAndUpdate(
    id, 
    updateData, 
    { new: true, runValidators: true }
  ).populate('creatorId', 'name email');
};

const deleteById = async (id) => {
  return await Poll.findByIdAndDelete(id);
};

const findActivePolls = async () => {
  return await Poll.find({ isActive: true })
    .populate('creatorId', 'name email')
    .sort({ createdAt: -1 });
};

const findPollsByCreator = async (creatorId) => {
  return await Poll.find({ creatorId })
    .populate('creatorId', 'name email')
    .sort({ createdAt: -1 });
};

module.exports = {
  create,
  findById,
  findAll,
  updateById,
  deleteById,
  findActivePolls,
  findPollsByCreator
};