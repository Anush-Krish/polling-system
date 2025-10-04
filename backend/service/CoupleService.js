// CoupleService.js
const Couple = require('../entity/Couple');
const Session = require('../entity/Session');
const CoupleDTO = require('../dto/CoupleDTO');

class CoupleService {
  // Create a new couple
  async createCouple(coupleData) {
    try {
      // Validate input data using DTO
      const validatedData = CoupleDTO.create(coupleData);
      
      // Check if couple with same access code already exists
      const existingCouple = await Couple.findOne({ accessCode: coupleData.accessCode });
      if (existingCouple) {
        throw new Error('Couple with this access code already exists');
      }
      
      const couple = new Couple(validatedData.toObject());
      await couple.save();
      
      return couple;
    } catch (error) {
      throw new Error(`Failed to create couple: ${error.message}`);
    }
  }

  // Authenticate a couple using access code
  async authenticateCouple(accessCode, partnerName) {
    try {
      const couple = await Couple.findOne({ accessCode, isActive: true });
      
      if (!couple) {
        throw new Error('Invalid access code');
      }
      
      // Check if the partner name matches one of the partners
      if (couple.partner1 !== partnerName && couple.partner2 !== partnerName) {
        throw new Error('Invalid partner name');
      }
      
      return couple;
    } catch (error) {
      throw new Error(`Authentication failed: ${error.message}`);
    }
  }

  // Update couple status
  async updateStatus(coupleId, status, location) {
    try {
      // Update status and set expiry to end of current day
      const statusExpiry = new Date(new Date().setHours(23, 59, 59, 999));
      
      const updatedCouple = await Couple.findByIdAndUpdate(
        coupleId,
        { 
          status, 
          statusExpiry,
          ...(location && { location })
        },
        { new: true }
      );
      
      if (!updatedCouple) {
        throw new Error('Couple not found');
      }
      
      return updatedCouple;
    } catch (error) {
      throw new Error(`Failed to update status: ${error.message}`);
    }
  }

  // Get couple details by ID
  async getCoupleById(coupleId) {
    try {
      const couple = await Couple.findById(coupleId);
      if (!couple) {
        throw new Error('Couple not found');
      }
      return couple;
    } catch (error) {
      throw new Error(`Failed to get couple: ${error.message}`);
    }
  }

  // Get couple by access code
  async getCoupleByAccessCode(accessCode) {
    try {
      const couple = await Couple.findOne({ accessCode, isActive: true });
      if (!couple) {
        throw new Error('Couple not found');
      }
      return couple;
    } catch (error) {
      throw new Error(`Failed to get couple: ${error.message}`);
    }
  }

  // Extend status expiry (for daily reset)
  async resetStatusForNewDay(coupleId) {
    try {
      const statusExpiry = new Date(new Date().setHours(23, 59, 59, 999));
      
      const updatedCouple = await Couple.findByIdAndUpdate(
        coupleId,
        { status: 'Not updated today', statusExpiry },
        { new: true }
      );
      
      if (!updatedCouple) {
        throw new Error('Couple not found');
      }
      
      return updatedCouple;
    } catch (error) {
      throw new Error(`Failed to reset status: ${error.message}`);
    }
  }
}

module.exports = new CoupleService();