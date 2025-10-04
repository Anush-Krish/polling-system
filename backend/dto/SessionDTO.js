// SessionDTO.js
class SessionDTO {
  constructor(data) {
    this.coupleId = data.coupleId;
    this.accessCode = data.accessCode;
    this.partnerName = data.partnerName;
    this.token = data.token;
    this.expiresAt = data.expiresAt;
  }

  static create(data) {
    // Input validation
    if (!data.coupleId) {
      throw new Error('Couple ID is required');
    }
    
    if (!data.accessCode || typeof data.accessCode !== 'string' || data.accessCode.trim().length === 0) {
      throw new Error('Access code is required and must be a non-empty string');
    }
    
    if (!data.partnerName || typeof data.partnerName !== 'string' || data.partnerName.trim().length === 0) {
      throw new Error('Partner name is required and must be a non-empty string');
    }
    
    if (!data.token || typeof data.token !== 'string' || data.token.trim().length === 0) {
      throw new Error('Token is required and must be a non-empty string');
    }
    
    if (!data.expiresAt || !(data.expiresAt instanceof Date)) {
      throw new Error('Expires at must be a valid Date object');
    }
    
    return new SessionDTO(data);
  }

  // Convert to plain object for database operations
  toObject() {
    return {
      coupleId: this.coupleId,
      accessCode: this.accessCode,
      partnerName: this.partnerName,
      token: this.token,
      expiresAt: this.expiresAt
    };
  }
}

module.exports = SessionDTO;