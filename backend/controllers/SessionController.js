// SessionController.js
const SessionService = require('../service/SessionService');

class SessionController {
  // Create a new session
  async createSession(req, res) {
    try {
      const { coupleId, accessCode, partnerName } = req.body;

      const session = await SessionService.createSession(coupleId, accessCode, partnerName);

      res.status(201).json({
        success: true,
        message: 'Session created successfully',
        data: session
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Verify session
  async verifySession(req, res) {
    try {
      const authHeader = req.headers['authorization'];
      const token = authHeader;

      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'No token provided'
        });
      }

      const sessionData = await SessionService.verifySession(token);

      res.status(200).json({
        success: true,
        message: 'Session verified successfully',
        data: sessionData
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message
      });
    }
  }

  // Deactivate session (logout)
  async deactivateSession(req, res) {
    try {
      const { token } = req.body;

      await SessionService.deactivateSession(token);

      res.status(200).json({
        success: true,
        message: 'Session deactivated successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Clean expired sessions
  async cleanExpiredSessions(req, res) {
    try {
      const result = await SessionService.cleanExpiredSessions();

      res.status(200).json({
        success: true,
        message: 'Expired sessions cleaned successfully',
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new SessionController();