// apps/backend/src/config/env.js
// Loads and validates environment variables at startup.
// The app will fail fast if required vars are missing.

require('dotenv').config();

const required = [
  'DATABASE_URL',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
];

for (const key of required) {
  if (!process.env[key]) {
    console.error(`❌ Missing required environment variable: ${key}`);
    process.exit(1);
  }
}

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),

  DATABASE_URL: process.env.DATABASE_URL,

  JWT_SECRET: process.env.JWT_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',

  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',

  UPLOAD_DIR: process.env.UPLOAD_DIR || './src/uploads',
  MAX_FILE_SIZE_MB: parseInt(process.env.MAX_FILE_SIZE_MB || '10', 10),

  NATIONAL_ID_PROVIDER: process.env.NATIONAL_ID_PROVIDER || 'MOCK',
  NATIONAL_ID_PROVIDER_URL: process.env.NATIONAL_ID_PROVIDER_URL || '',
  NATIONAL_ID_PROVIDER_KEY: process.env.NATIONAL_ID_PROVIDER_KEY || '',

  PUBLIC_BASE_URL: process.env.PUBLIC_BASE_URL || 'http://localhost:5000',

  isDev: (process.env.NODE_ENV || 'development') === 'development',
  isProd: process.env.NODE_ENV === 'production',
};

module.exports = env;
