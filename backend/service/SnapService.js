// SnapService.js
const Snap = require('../entity/Snap');
const SnapDTO = require('../dto/SnapDTO');
const Couple = require('../entity/Couple');
const { uploadImageToR2 } = require('../utils/r2Upload');

class SnapService {
  // Upload a new snap
  async uploadSnap(snapData) {
    try {
      // Validate input data using DTO
      const validatedData = SnapDTO.create(snapData);
      
      // Check if couple exists and is active
      const couple = await Couple.findById(snapData.coupleId);
      if (!couple || !couple.isActive) {
        throw new Error('Couple not found or inactive');
      }
      
      // Check if the user is one of the partners
      if (couple.partner1 !== snapData.uploadedBy && couple.partner2 !== snapData.uploadedBy) {
        throw new Error('Unauthorized: Not a partner in this couple');
      }
      
      // Count existing snaps for this couple to check limit (max 6 per day)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const snapCount = await Snap.countDocuments({
        coupleId: snapData.coupleId,
        uploadDate: {
          $gte: today
        },
        isActive: true
      });
      
      if (snapCount >= 6) {
        throw new Error('Snap limit reached: maximum 6 snaps per day');
      }
      
      // If imageUrl is a data URL, we need to upload it to R2
      let imageUrl = snapData.imageUrl;
      let r2Key = snapData.r2Key;
      
      if (snapData.imageUrl.startsWith('data:image')) {
        console.log('Attempting to upload image to R2...');
        // Convert data URL to buffer
        const base64Data = snapData.imageUrl.replace(/^data:image\/\w+;base64,/, '');
        const imageBuffer = Buffer.from(base64Data, 'base64');
        
        // Upload to R2
        const uploadResult = await uploadImageToR2(imageBuffer, 'snap.jpg');
        if (!uploadResult.success) {
          console.error('R2 upload failed:', uploadResult.error);
          throw new Error(`Failed to upload image to R2: ${uploadResult.error}`);
        }
        
        console.log('R2 upload successful:', uploadResult);
        imageUrl = uploadResult.imageUrl;
        r2Key = uploadResult.r2Key;
      } else {
        console.log('Using existing image URL:', snapData.imageUrl);
      }
      
      const snap = new Snap({
        ...validatedData.toObject(),
        imageUrl,
        r2Key
      });
      await snap.save();
      
      return snap;
    } catch (error) {
      throw new Error(`Failed to upload snap: ${error.message}`);
    }
  }

  // Get snaps for a couple
  async getSnapsForCouple(coupleId) {
    try {
      // Check if couple exists and is active
      const couple = await Couple.findById(coupleId);
      if (!couple || !couple.isActive) {
        throw new Error('Couple not found or inactive');
      }
      
      // Get snaps for the couple, sorted by upload date (newest first)
      const snaps = await Snap.find({
        coupleId,
        isActive: true
      }).sort({ uploadDate: -1 });
      
      return snaps;
    } catch (error) {
      throw new Error(`Failed to get snaps: ${error.message}`);
    }
  }

  // Delete a snap (only by the uploader or admin)
  async deleteSnap(snapId, partnerName) {
    try {
      // Find the snap
      const snap = await Snap.findById(snapId);
      if (!snap || !snap.isActive) {
        throw new Error('Snap not found');
      }
      
      // Check if couple exists and is active
      const couple = await Couple.findById(snap.coupleId);
      if (!couple || !couple.isActive) {
        throw new Error('Couple not found or inactive');
      }
      
      // Check if the user is the one who uploaded it
      if (snap.uploadedBy !== partnerName) {
        throw new Error('Unauthorized: Only the uploader can delete this snap');
      }
      
      // Soft delete the snap
      const updatedSnap = await Snap.findByIdAndUpdate(
        snapId,
        { isActive: false },
        { new: true }
      );
      
      return updatedSnap;
    } catch (error) {
      throw new Error(`Failed to delete snap: ${error.message}`);
    }
  }

  // Get snaps for the current day
  async getTodaysSnaps(coupleId) {
    try {
      // Check if couple exists and is active
      const couple = await Couple.findById(coupleId);
      if (!couple || !couple.isActive) {
        throw new Error('Couple not found or inactive');
      }
      
      // Calculate start of today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Get snaps for today, sorted by upload date (newest first)
      const snaps = await Snap.find({
        coupleId,
        uploadDate: {
          $gte: today
        },
        isActive: true
      }).sort({ uploadDate: -1 });
      
      return snaps;
    } catch (error) {
      throw new Error(`Failed to get today's snaps: ${error.message}`);
    }
  }
}

module.exports = new SnapService();