import * as process from 'process';

export const configuration = () => ({
  db: {
    uri: process.env.DATABASE_URL,
  },
  origin: process.env.ORIGIN,
  storage: {
    s3: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      bucketName: process.env.S3_BUCKET_NAME,
    },
  },
  auth: {
    jwt: {
      secret: process.env.JWT_SECRET,
      refreshSecret: process.env.JWT_REFRESH_SECRET,
    },
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});
