import dotenv from 'dotenv';

dotenv.config();

interface ConfigTypes {
  PORT: string;
  SERVER_URL: string;
  CLIENT_URL: string;
  NODE_ENV: string;
  JWT_SECRET: string;
  MONGO_URI: string;
}

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

const config: ConfigTypes = {
  PORT: process.env.PORT,
  SERVER_URL: process.env.SERVER_URL,
  CLIENT_URL: process.env.CLIENT_URL,
  NODE_ENV: process.env.NODE_ENV,
  JWT_SECRET: process.env.JWT_SECRET,
  MONGO_URI: process.env.MONGO_URI,
};

export default config;
