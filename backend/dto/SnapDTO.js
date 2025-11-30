// SnapDTO.js
class SnapDTO {
  constructor(data) {
    this.coupleId = data.coupleId;
    this.uploadedBy = data.uploadedBy;
    this.imageUrl = data.imageUrl;
    this.r2Key = data.r2Key;
    this.caption = data.caption;
    this.mediaType = data.mediaType || 'image';
    this.source = data.source || 'gallery';
  }

  static create(data) {
    // Input validation
    if (!data.coupleId) {
      throw new Error('Couple ID is required');
    }

    if (!data.uploadedBy || typeof data.uploadedBy !== 'string' || data.uploadedBy.trim().length === 0) {
      throw new Error('Uploaded by is required and must be a non-empty string');
    }

    if (!data.imageUrl || typeof data.imageUrl !== 'string' || data.imageUrl.trim().length === 0) {
      throw new Error('Image URL is required and must be a non-empty string');
    }

    if (data.r2Key && typeof data.r2Key !== 'string') {
      throw new Error('R2 key must be a string if provided');
    }

    if (data.caption && typeof data.caption !== 'string') {
      throw new Error('Caption must be a string if provided');
    }

    if (data.mediaType && !['image', 'video'].includes(data.mediaType)) {
      throw new Error('Invalid media type');
    }

    if (data.source && !['camera', 'gallery'].includes(data.source)) {
      throw new Error('Invalid source');
    }

    return new SnapDTO(data);
  }

  // Convert to plain object for database operations
  toObject() {
    return {
      coupleId: this.coupleId,
      uploadedBy: this.uploadedBy,
      imageUrl: this.imageUrl,
      r2Key: this.r2Key,
      caption: this.caption,
      mediaType: this.mediaType,
      source: this.source
    };
  }
}

module.exports = SnapDTO;