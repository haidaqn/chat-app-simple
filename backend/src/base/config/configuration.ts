import * as process from 'process';

export const configuration = () => ({
  db: {
    uri: process.env.DATABASE_URL,
  },
  origin: process.env.ORIGIN,
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
