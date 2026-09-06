import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: [true, 'Username must be unique'],
      trim: true,
      lowercase: true,
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: [true, 'Email must be unique'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },

    phoneNumber: {
      type: String,
      required: [true, 'Phone Number is required'],
      unique: [true, 'Phone Number must be unique'],
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
    },

    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const userModel = mongoose.model('User', userSchema);

export default userModel;
