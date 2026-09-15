import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },

    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: [true, 'Username must be unique'],
      trim: true,
      lowercase: true,
    },

    email: {
      type: String,
      unique: [true, 'Email must be unique'],
      sparse: true,
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
    },

    account_status: {
      type: Boolean,
      default: false,
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const userModel = mongoose.model('User', userSchema, 'user');

export default userModel;
