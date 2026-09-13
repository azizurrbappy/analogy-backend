import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    fullName: {
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
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },

    phoneNumber: {
      type: String,
      unique: [true, 'Phone Number must be unique'],
      sparse: true,
      trim: true,
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

    is_email_verified: {
      type: Boolean,
      default: false,
    },

    is_phone_verified: {
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
