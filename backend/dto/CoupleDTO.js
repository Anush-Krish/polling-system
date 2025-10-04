// CoupleDTO.js
class CoupleDTO {
  constructor(data) {
    this.coupleName = data.coupleName;
    this.partner1 = data.partner1;
    this.partner2 = data.partner2;
    this.accessCode = data.accessCode;
    this.status = data.status || 'Not updated today';
    this.location = data.location;
  }

  static create(data) {
    // Input validation
    if (!data.coupleName || typeof data.coupleName !== 'string' || data.coupleName.trim().length === 0) {
      throw new Error('Couple name is required and must be a non-empty string');
    }
    
    if (!data.partner1 || typeof data.partner1 !== 'string' || data.partner1.trim().length === 0) {
      throw new Error('Partner 1 name is required and must be a non-empty string');
    }
    
    if (!data.partner2 || typeof data.partner2 !== 'string' || data.partner2.trim().length === 0) {
      throw new Error('Partner 2 name is required and must be a non-empty string');
    }
    
    if (!data.accessCode || typeof data.accessCode !== 'string' || data.accessCode.trim().length === 0) {
      throw new Error('Access code is required and must be a non-empty string');
    }
    
    if (data.status && typeof data.status !== 'string') {
      throw new Error('Status must be a string if provided');
    }
    
    if (data.location) {
      if (typeof data.location !== 'object') {
        throw new Error('Location must be an object');
      }
      
      if (data.location.lat !== undefined && typeof data.location.lat !== 'number') {
        throw new Error('Location lat must be a number if provided');
      }
      
      if (data.location.lng !== undefined && typeof data.location.lng !== 'number') {
        throw new Error('Location lng must be a number if provided');
      }
      
      if (data.location.address && typeof data.location.address !== 'string') {
        throw new Error('Location address must be a string if provided');
      }
    }
    
    return new CoupleDTO(data);
  }

  // Convert to plain object for database operations
  toObject() {
    return {
      coupleName: this.coupleName,
      partner1: this.partner1,
      partner2: this.partner2,
      accessCode: this.accessCode,
      status: this.status,
      location: this.location
    };
  }
}

module.exports = CoupleDTO;