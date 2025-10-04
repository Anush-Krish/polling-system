const mongoose = require('mongoose');

const snapSchema = new mongoose.Schema({
  coupleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Couple',
    required: true
  },
  uploadedBy: {
    type: String,
    required: true,
    trim: true
  },
  imageUrl: {
    type: String,
    required: true,
    trim: true
  },
  cloudinaryId: {
    type: String,
    required: false, // For potential future use with Cloudinary
    trim: true
  },
  r2Key: {
    type: String,
    required: false, // The key in R2 storage
    trim: true
  },
  caption: {
    type: String,
    required: false,
    trim: true
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
snapSchema.index({ coupleId: 1 });
snapSchema.index({ uploadDate: -1 });
snapSchema.index({ uploadedBy: 1 });

module.exports = mongoose.model('Snap', snapSchema);