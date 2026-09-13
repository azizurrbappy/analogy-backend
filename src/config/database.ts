import mongoose from 'mongoose';
import config from './config.js';

async function connectDB() {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log('[database]: Already connected');
      return;
    }

    await mongoose.connect(config.MONGO_URI);

    console.log('[database]: Database connected successfully');
  } catch (err) {
    console.error('[database error]: Database connection error', err);

    throw err;
  }
}

export default connectDB;
