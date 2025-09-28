const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['student', 'teacher'],
    required: true,
    default: 'student'
  },
  pollsCreated: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Poll'
  }],
  pollsParticipated: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Poll'
  }]
}, {
  timestamps: true
});

// Index for efficient queries
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

module.exports = mongoose.model('User', userSchema);