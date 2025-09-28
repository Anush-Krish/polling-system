// Vote Entity/Model for Live Polling System using Mongoose
const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  pollId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Poll',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  optionIndex: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
voteSchema.index({ pollId: 1, userId: 1 }, { unique: true }); // Prevent duplicate votes
voteSchema.index({ pollId: 1 });

module.exports = mongoose.model('Vote', voteSchema);