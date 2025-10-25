// SnapController.js
const SnapService = require('../service/SnapService');
const { authenticateToken } = require('../middleware/authMiddleware');

class SnapController {
  constructor(io) {
    this.io = io;
  }

  // Upload a new snap
  async uploadSnap(req, res) {
    try {
      const { coupleId, uploadedBy, imageUrl, r2Key, caption } = req.body;

      const snap = await SnapService.uploadSnap({
        coupleId,
        uploadedBy,
        imageUrl,
        r2Key,
        caption
      });

      // Emit a Socket.IO event for new snap
      this.io.to(coupleId).emit('newSnap', snap);

      res.status(201).json({
        success: true,
        message: 'Snap uploaded successfully',
        data: {
          _id: snap._id,
          coupleId: snap.coupleId,
          uploadedBy: snap.uploadedBy,
          imageUrl: snap.imageUrl,
          caption: snap.caption,
          uploadDate: snap.uploadDate
        }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get snaps for a couple
  async getSnaps(req, res) {
    try {
      const { coupleId } = req.params;

      const snaps = await SnapService.getSnapsForCouple(coupleId);

      res.status(200).json({
        success: true,
        data: snaps
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get today's snaps for a couple
  async getTodaysSnaps(req, res) {
    try {
      const { coupleId } = req.params;

      const snaps = await SnapService.getTodaysSnaps(coupleId);

      res.status(200).json({
        success: true,
        data: snaps
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  // Delete a snap
  async deleteSnap(req, res) {
    try {
      const { snapId } = req.params;
      const { partnerName } = req.body;

      const deletedSnap = await SnapService.deleteSnap(snapId, partnerName);

      // Emit a Socket.IO event for deleted snap
      this.io.to(deletedSnap.coupleId).emit('snapDeleted', { snapId: deletedSnap._id });

      res.status(200).json({
        success: true,
        message: 'Snap deleted successfully',
        data: deletedSnap
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
  
  // Middleware to apply authentication
  get authenticateToken() {
    return authenticateToken;
  }
}

module.exports = SnapController;