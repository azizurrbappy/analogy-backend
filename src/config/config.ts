import dotenv from 'dotenv';
import type ConfigTypes from '../types/config.type.js';

dotenv.config();

if (!process.env.PORT) {
  throw new Error('PORT is not defined in environment variable');
}

if (!process.env.SERVER_URL) {
  throw new Error('SERVER_URL is not defined in environment variable');
}

if (!process.env.CLIENT_URL) {
  throw new Error('CLIENT_URL is not defined in environment variable');
}

if (!process.env.NODE_ENV) {
  throw new Error('NODE_ENV is not defined in environment variable');
}

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variable');
}

if (!process.env.MONGO_URI) {
  throw new Error('MONGO_URI is not defined in environment variable');
}

if (!process.env.BULK_API_KEY) {
  throw new Error('BULK_API_KEY is not defined in environment variable');
}

if (!process.env.BULK_SENDER_ID) {
  throw new Error('BULK_SENDER_ID is not defined in environment variable');
}

if (!process.env.GATE_USERNAME) {
  throw new Error('GATE_USERNAME is not defined in environment variable');
}

if (!process.env.GATE_PASSWORD) {
  throw new Error('GATE_PASSWORD is not defined in environment variable');
}

if (!process.env.GATE_DEVICE_ID) {
  throw new Error('GATE_DEVICE_ID is not defined in environment variable');
}

if (!process.env.GATE_SIM) {
  throw new Error('GATE_SIM is not defined in environment variable');
}

if (!process.env.MAIL_API_KEY) {
  throw new Error('MAIL_API_KEY is not defined in environment variable');
}

if (!process.env.CLOUDFLARE_ACCOUNT_ID) {
  throw new Error('CLOUDFLARE_ACCOUNT_ID is not defined in environment variable');
}

if (!process.env.MAIL_FROM) {
  throw new Error('MAIL_FROM is not defined in environment variable');
}

if (!process.env.APP_NAME) {
  throw new Error('APP_NAME is not defined in environment variable');
}

const config: ConfigTypes = {
  // Server
  PORT: process.env.PORT,
  SERVER_URL: process.env.SERVER_URL,
  CLIENT_URL: process.env.CLIENT_URL,
  NODE_ENV: process.env.NODE_ENV,

  // JWT Secret
  JWT_SECRET: process.env.JWT_SECRET,

  // Database
  MONGO_URI: process.env.MONGO_URI,

  // SMS Providers
  BULK_API_KEY: process.env.BULK_API_KEY,
  BULK_SENDER_ID: process.env.BULK_SENDER_ID,
  GATE_USERNAME: process.env.GATE_USERNAME,
  GATE_PASSWORD: process.env.GATE_PASSWORD,
  GATE_DEVICE_ID: process.env.GATE_DEVICE_ID,
  GATE_SIM: process.env.GATE_SIM,

  // Cloudflare
  MAIL_API_KEY: process.env.MAIL_API_KEY,
  CLOUDFLARE_ACCOUNT_ID: process.env.CLOUDFLARE_ACCOUNT_ID,
  MAIL_FROM: process.env.MAIL_FROM,
  APP_NAME: process.env.APP_NAME,
};

export default config;
