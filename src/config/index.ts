import dotenv from 'dotenv';
dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',

  port: parseInt(process.env.PORT || '3000', 10),

  webhookSecret: process.env.WEBHOOK_SECRET || '',

  redisUrl: process.env.REDIS_URL || '',

  db: {
    url: process.env.DATABASE_URL || '',
  },

  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    model: process.env.MODEL || 'gpt-4o-mini', // safer default
  },

  sentry: {
    dsn: process.env.SENTRY_DSN || '',
  },
};
