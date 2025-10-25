// CoupleService.js
const Couple = require('../entity/Couple');
const Session = require('../entity/Session');
const CoupleDTO = require('../dto/CoupleDTO');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
      
      // Hash the access code
      const hashedPassword = await bcrypt.hash(coupleData.accessCode, 10);
      
      const couple = new Couple({
        ...validatedData.toObject(),
        accessCode: hashedPassword // Store hashed access code
      });
      await couple.save();
      
      return couple;
    } catch (error) {
      throw new Error(`Failed to create couple: ${error.message}`);
    }
  }

  // Authenticate a couple using access code
  async authenticateCouple(coupleName, accessCode, partnerName) {
    try {
      console.log('Attempting to authenticate couple...');
      console.log('Provided coupleName:', coupleName);
      console.log('Provided accessCode:', accessCode);
      console.log('Provided partnerName:', partnerName);

      const couple = await Couple.findOne({ coupleName, isActive: true });
      
      if (!couple) {
        console.log('Couple not found or inactive.');
        throw new Error('Invalid couple name or couple not found');
      }
      console.log('Couple found:', couple.coupleName, couple._id);
      console.log('Stored hashed accessCode:', couple.accessCode);

      // Compare provided access code with hashed access code
      const isMatch = await bcrypt.compare(accessCode, couple.accessCode);
      console.log('bcrypt.compare result (isMatch):', isMatch);
      if (!isMatch) {
        throw new Error('Invalid access code');
      }
      
      // Check if the partner name matches one of the partners
      if (couple.partner1 !== partnerName && couple.partner2 !== partnerName) {
        console.log('Partner name mismatch. Stored partners:', couple.partner1, couple.partner2);
        throw new Error('Invalid partner name');
      }
      console.log('Partner name matched.');
      
      // Generate JWT
      const token = jwt.sign(
        { coupleId: couple._id, partnerName: partnerName },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );
      console.log('JWT generated.');

      // Create a session entry
      const session = new Session({
        token: token,
        coupleId: couple._id,
        partnerName: partnerName,
        expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days from now
      });
      await session.save();
      console.log('Session saved.');
      
      return { couple, token };
    } catch (error) {
      console.error('Authentication failed in service:', error.message);
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