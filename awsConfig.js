import AWS from 'aws-sdk';

AWS.config.update({
  accessKeyId: 'process.env.AWS_ACCESS_KEY_ID',
  secretAccessKey: 'process.env.AWS_SECRET_ACCESS_KEY',
  sessionToken: 'process.env.AWS_SESSION_TOKEN',
  region: 'us-east-1',
});

const s3 = new AWS.S3();

export default s3;
