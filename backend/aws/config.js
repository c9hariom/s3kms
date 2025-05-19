// awsConfig.js
const AWS = require('aws-sdk');
require('dotenv').config();

const key = process.env.ACCESS_KEY
const secret =  process.env.SECRET_ACCESS_KEY
AWS.config.update({
  region: 'eu-north-1', // e.g., 'us-east-1'
  accessKeyId: key,
  secretAccessKey: secret
});

const s3 = new AWS.S3();
module.exports = s3;
