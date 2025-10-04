const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  coupleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Couple',
    required: true
  },
  accessCode: {
    type: String,
    required: true,
    trim: true
  },
  partnerName: {
    type: String,
    required: true,
    trim: true
  },
  token: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from creation
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
sessionSchema.index({ token: 1 });
sessionSchema.index({ accessCode: 1, partnerName: 1 });
sessionSchema.index({ expiresAt: 1 });

module.exports = mongoose.model('Session', sessionSchema);