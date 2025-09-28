// UserRepository for Live Polling System
const User = require('../entity/userEntity');

const create = async (userData) => {
  const user = new User(userData);
  return await user.save();
};

const findByEmail = async (email) => {
  return await User.findOne({ email: email });
};

const findById = async (id) => {
  return await User.findById(id).select('-password');
};

const findByIdAndUpdate = async (id, updateData) => {
  return await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
    .select('-password');
};

const deleteById = async (id) => {
  return await User.findByIdAndDelete(id);
};

module.exports = {
  create,
  findByEmail,
  findById,
  findByIdAndUpdate,
  deleteById
};