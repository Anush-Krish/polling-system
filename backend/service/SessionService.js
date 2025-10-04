// SessionService.js
const Session = require('../entity/Session');
const jwt = require('jsonwebtoken');
const SessionDTO = require('../dto/SessionDTO');

class SessionService {
  constructor() {
    this.JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';
  }

  // Create a new session for a couple
  async createSession(coupleId, accessCode, partnerName) {
    try {
      // Generate JWT token
      const token = jwt.sign(
        { coupleId: coupleId.toString(), partnerName },
        this.JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Create session object using DTO
      const sessionData = {
        coupleId,
        accessCode,
        partnerName,
        token,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
      };

      const validatedSession = SessionDTO.create(sessionData);
      const session = new Session(validatedSession.toObject());
      await session.save();

      return {
        token: session.token,
        partnerName: session.partnerName,
        expiresAt: session.expiresAt
      };
    } catch (error) {
      throw new Error(`Failed to create session: ${error.message}`);
    }
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