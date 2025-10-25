// SessionService.js
const Session = require('../entity/Session');
const jwt = require('jsonwebtoken');
// SessionDTO is no longer needed as session creation is handled directly
// const SessionDTO = require('../dto/SessionDTO');

class SessionService {
  constructor() {
    // Use process.env directly, no need for fallback here as dotenv is loaded
    this.JWT_SECRET = process.env.JWT_SECRET;
  }

  // Verify session token
  async verifySession(token) {
    try {
      // First, check if the session exists in the database and is active
      const session = await Session.findOne({ token, isActive: true });
      if (!session) {
        throw new Error('Session not found or inactive');
      }

      // Then verify the JWT token
      const decoded = jwt.verify(token, this.JWT_SECRET);
      return {
        coupleId: decoded.coupleId,
        partnerName: decoded.partnerName
      };
    } catch (error) {
      if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        throw new Error('Invalid or expired token');
      }
      throw new Error(`Session verification failed: ${error.message}`);
    }
  }

  // Deactivate session (logout)
  async deactivateSession(token) {
    try {
      const result = await Session.updateOne(
        { token },
        { isActive: false }
      );

      if (result.matchedCount === 0) {
        throw new Error('Session not found');
      }

      return { message: 'Session deactivated successfully' };
    } catch (error) {
      throw new Error(`Failed to deactivate session: ${error.message}`);
    }
  }

  // Invalidate all active sessions for a specific partner within a couple
  async invalidateOldSessions(coupleId, partnerName) {
    try {
      await Session.updateMany(
        { coupleId, partnerName, isActive: true },
        { isActive: false }
      );
      return { message: `Old sessions for ${partnerName} in couple ${coupleId} invalidated.` };
    } catch (error) {
      throw new Error(`Failed to invalidate old sessions: ${error.message}`);
    }
  }

  // Clean expired sessions
  async cleanExpiredSessions() {
    try {
      const result = await Session.deleteMany({
        expiresAt: { $lt: new Date() },
        isActive: true
      });

      return { deletedCount: result.deletedCount };
    } catch (error) {
      throw new Error(`Failed to clean expired sessions: ${error.message}`);
    }
  }
}

module.exports = new SessionService();