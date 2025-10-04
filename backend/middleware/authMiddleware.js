// authMiddleware.js
const SessionService = require('../service/SessionService');

const authenticateToken = async (req, res, next) => {
  // Get token from header
  const authHeader = req.headers['authorization'];
  const token = authHeader; // For simplicity, sending token directly in authorization header

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Access token required' 
    });
  }

  try {
    // Verify the token using SessionService
    const sessionData = await SessionService.verifySession(token);
    
    // Add session data to request object
    req.sessionData = sessionData;
    
    next();
  } catch (error) {
    return res.status(403).json({ 
      success: false, 
      message: error.message 
    });
  }
};

module.exports = { authenticateToken };