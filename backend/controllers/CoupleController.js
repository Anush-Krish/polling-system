// CoupleController.js
const CoupleService = require('../service/CoupleService');

class CoupleController {
  // Create a new couple
  async createCouple(req, res) {
    try {
      const { coupleName, partner1, partner2, accessCode, location } = req.body;

      const couple = await CoupleService.createCouple({
        coupleName,
        partner1,
        partner2,
        accessCode,
        location
      });

      res.status(201).json({
        success: true,
        message: 'Couple created successfully',
        data: {
          _id: couple._id,
          coupleName: couple.coupleName,
          partner1: couple.partner1,
          partner2: couple.partner2,
          accessCode: couple.accessCode
        }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Authenticate couple
  async authenticateCouple(req, res) {
    try {
      const { accessCode, partnerName } = req.body;

      const couple = await CoupleService.authenticateCouple(accessCode, partnerName);

      res.status(200).json({
        success: true,
        message: 'Authentication successful',
        data: {
          _id: couple._id,
          coupleName: couple.coupleName,
          partner1: couple.partner1,
          partner2: couple.partner2,
          status: couple.status,
          location: couple.location
        }
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message
      });
    }
  }

  // Update couple status
  async updateStatus(req, res) {
    try {
      const { coupleId } = req.params;
      const { status, location } = req.body;

      const updatedCouple = await CoupleService.updateStatus(coupleId, status, location);

      res.status(200).json({
        success: true,
        message: 'Status updated successfully',
        data: {
          _id: updatedCouple._id,
          status: updatedCouple.status,
          statusExpiry: updatedCouple.statusExpiry,
          location: updatedCouple.location
        }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get couple details
  async getCouple(req, res) {
    try {
      const { coupleId } = req.params;

      const couple = await CoupleService.getCoupleById(coupleId);

      res.status(200).json({
        success: true,
        data: {
          _id: couple._id,
          coupleName: couple.coupleName,
          partner1: couple.partner1,
          partner2: couple.partner2,
          status: couple.status,
          statusExpiry: couple.statusExpiry,
          location: couple.location
        }
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  // Reset status for new day
  async resetStatusForNewDay(req, res) {
    try {
      const { coupleId } = req.params;

      const updatedCouple = await CoupleService.resetStatusForNewDay(coupleId);

      res.status(200).json({
        success: true,
        message: 'Status reset successfully',
        data: {
          _id: updatedCouple._id,
          status: updatedCouple.status,
          statusExpiry: updatedCouple.statusExpiry
        }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new CoupleController();