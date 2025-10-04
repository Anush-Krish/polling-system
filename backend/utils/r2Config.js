// r2Config.js
const { S3Client } = require('@aws-sdk/client-s3');

// Create R2 client
const r2Client = new S3Client({
  region: 'auto', // R2 doesn't require a specific region
  endpoint: process.env.R2_ENDPOINT || 'https://396e002de9ba2adacec4dcb72f7c96c2.r2.cloudflarestorage.com',
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || ''
  }
});

module.exports = { r2Client };