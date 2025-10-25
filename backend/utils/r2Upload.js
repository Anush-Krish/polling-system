// r2Upload.js
const { PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
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
    

    return {
      success: true,

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

async function getSignedUrlForR2(key) {
  try {
    const command = new GetObjectCommand({
      Bucket: 'anush-dev',
      Key: key
    });
    const signedUrl = await getSignedUrl(r2Client, command, { expiresIn: 3600 }); // URL valid for 1 hour
    return signedUrl;
  } catch (error) {
    console.error('Error generating signed URL for R2:', error);
    throw new Error(`Failed to generate signed URL: ${error.message}`);
  }
}

module.exports = { uploadImageToR2, getSignedUrlForR2 };