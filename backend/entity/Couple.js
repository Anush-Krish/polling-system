const mongoose = require('mongoose');

const coupleSchema = new mongoose.Schema({
  coupleName: {
    type: String,
    required: true,
    trim: true
  },
  partner1: {
    type: String,
    required: true,
    trim: true
  },
  partner2: {
    type: String,
    required: true,
    trim: true
  },
  accessCode: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  status: {
    type: String,
    required: true,
    default: 'Not updated today',
    trim: true
  },
  statusExpiry: {
    type: Date,
    required: true,
    default: () => new Date(new Date().setHours(23, 59, 59, 999)) // Expires at end of current day
  },
  location: {
    lat: {
      type: Number,
      required: false
    },
    lng: {
      type: Number,
      required: false
    },
    address: {
      type: String,
      required: false,
      trim: true
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
coupleSchema.index({ accessCode: 1 });
coupleSchema.index({ createdAt: 1 });
coupleSchema.index({ statusExpiry: 1 });

module.exports = mongoose.model('Couple', coupleSchema);