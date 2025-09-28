// Poll Entity/Model for Live Polling System using Mongoose
const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true
  },
  options: [{
    id: {
      type: Number,
      required: true
    },
    text: {
      type: String,
      required: true,
      trim: true
    },
    votes: {
      type: Number,
      default: 0
    }
  }],
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false  // Changed to false to allow live polls without a specific creator
  },
  isActive: {
    type: Boolean,
    default: true
  },
  participants: [{
    name: {
      type: String,
      required: true
    },
    socketId: {
      type: String,
      required: true
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    hasVoted: {
      type: Boolean,
      default: false
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date
  }
});

// Method to calculate total votes
pollSchema.virtual('totalVotes').get(function() {
  return this.options.reduce((total, option) => total + option.votes, 0);
});

// Index for efficient queries
pollSchema.index({ createdAt: -1 });
pollSchema.index({ isActive: 1 });
pollSchema.index({ creatorId: 1 });

module.exports = mongoose.model('Poll', pollSchema);