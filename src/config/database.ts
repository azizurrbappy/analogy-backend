import mongoose from 'mongoose';
import config from './config.js';

async function connectDB() {
  try {
    await mongoose.connect(config.MONGO_URI);

    console.log('[database]: Database connected successfully');
  } catch (err) {
    console.log('[database error]: Database connection error');
  }
}

export default connectDB;
