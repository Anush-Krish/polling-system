// r2Upload.js
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const { r2Client } = require('./r2Config');
const { randomUUID } = require('crypto');

async function uploadImageToR2(imageBuffer, originalName, folder = 'snaps') {
  try {
    console.log('Starting upload to R2...');
    console.log('Image buffer size:', imageBuffer.length);
    
    // Generate a unique filename using UUID
    const fileExtension = originalName.split('.').pop();
    const uniqueFileName = `${folder}/${randomUUID()}.${fileExtension}`;
    
    console.log('Attempting to upload to R2 with key:', uniqueFileName);
    
    const command = new PutObjectCommand({
      Bucket: 'anush-dev', // The bucket name from the requirement
      Key: uniqueFileName,
      Body: imageBuffer,
      ContentType: `image/${fileExtension}`
    });
    
    await r2Client.send(command);
    
    console.log('Upload to R2 successful');
    
    // Return the public URL for the uploaded image
    const imageUrl = `https://396e002de9ba2adacec4dcb72f7c96c2.r2.cloudflarestorage.com/anush-dev/${uniqueFileName}`;
    
    return {
      success: true,
      imageUrl,
      r2Key: uniqueFileName
    };
  } catch (error) {
    console.error('Error uploading to R2:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

module.exports = { uploadImageToR2 };