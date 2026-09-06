import type { Request, Response } from 'express';
import userModel from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import sessionModel from '../models/session.model.js';
import crypto from 'crypto';

export async function signup(req: Request, res: Response) {
  const { email, phoneNumber, password } = req.body;

  const userExist = await userModel.findOne({
    $or: [{ email: email?.toLowerCase().trim() }, { phoneNumber }],
  });

  if (userExist) {
    return res.status(409).json({
      success: false,
      message: 'Email or phoneNumber already exists',
    });
  }

  const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

  const user = await userModel.create({
    email,
    phoneNumber,
    password: hashedPassword,
  });

  const refreshToken = jwt.sign(
    {
      id: user._id,
      email: user.email,
      phoneNumber: user.phoneNumber,
    },
    config.JWT_SECRET,
    {
      expiresIn: '7d',
    },
  );

  const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

  const session = await sessionModel.create({
    userId: user._id,
    refreshTokenHash,
    ip: req.ip ?? 'unknown',
    userAgent: req.headers['user-agent'] ?? 'unknown',
  });

  const accessToken = jwt.sign(
    {
      id: user._id,
      email: user.email,
      phoneNumber: user.phoneNumber,
    },
    config.JWT_SECRET,
    {
      expiresIn: '15m',
    },
  );

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Days
  });

  return res.status(201).json({
    success: true,
    message: 'User signup successfully',
    data: {
      email: user.email,
      phoneNumber: user.phoneNumber,
    },
    accessToken,
  });
}

export async function login(req: Request, res: Response) {
  const { email, phoneNumber, password } = req.body;

  const searchConditions = [];
  if (email) {
    searchConditions.push({ email: email.toLowerCase().trim() });
  }
  if (phoneNumber) {
    searchConditions.push({ phoneNumber });
  }

  if (searchConditions.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Email or phoneNumber is required',
    });
  }

  const user = await userModel.findOne({
    $or: searchConditions,
  });

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or phoneNumber',
    });
  }

  const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

  const isPasswordValid = hashedPassword === user.password;

  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: 'Invalid password',
    });
  }

  const refreshToken = jwt.sign(
    {
      id: user._id,
      email: user.email,
      phoneNumber: user.phoneNumber,
    },
    config.JWT_SECRET,
    {
      expiresIn: '7d',
    },
  );

  const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

  const session = await sessionModel.create({
    userId: user._id,
    refreshTokenHash,
    ip: req.ip || 'unknown',
    userAgent: req.headers['user-agent'] || 'unknown',
  });

  const accessToken = jwt.sign(
    {
      id: user._id,
      email: user.email,
      phoneNumber: user.phoneNumber,
    },
    config.JWT_SECRET,
    {
      expiresIn: '15m',
    },
  );

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Days
  });

  return res.status(200).json({
    success: true,
    message: 'Logged in successful',
    accessToken,
  });
}

export async function getMe(req: Request, res: Response) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorize access',
    });
  }

  const decoded = jwt.verify(token, config.JWT_SECRET);

  if (typeof decoded === 'string') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
    });
  }

  const user = await userModel.findById(decoded.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  return res.status(200).json({
    success: true,
    message: 'User fetched successful',
    data: {
      email: user.email,
      phoneNumber: user.phoneNumber,
    },
  });
}

export async function refreshToken(req: Request, res: Response) {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized access',
    });
  }

  const decoded = jwt.verify(refreshToken, config.JWT_SECRET);

  if (typeof decoded === 'string') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
    });
  }

  const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

  const session = await sessionModel.findOne({
    refreshTokenHash,
    revoked: false,
  });

  if (!session) {
    return res.status(401).json({
      success: false,
      message: 'Invalid refresh token',
    });
  }

  const accessToken = jwt.sign(
    {
      id: decoded.id,
      email: decoded.email,
      phoneNumber: decoded.phoneNumber,
    },
    config.JWT_SECRET,
    {
      expiresIn: '15m',
    },
  );

  const newRefreshToken = jwt.sign(
    {
      id: decoded.id,
      email: decoded.email,
      phoneNumber: decoded.phoneNumber,
    },
    config.JWT_SECRET,
    {
      expiresIn: '7d',
    },
  );

  const newRefreshTokenHash = crypto.createHash('sha256').update(newRefreshToken).digest('hex');

  session.refreshTokenHash = newRefreshTokenHash;
  await session.save();

  res.cookie('refreshToken', newRefreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Days
  });

  return res.status(200).json({
    success: true,
    message: 'Access token refreshed successfully',
    accessToken,
  });
}

export async function logout(req: Request, res: Response) {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    res.status(400).json({
      success: true,
      message: 'Refresh token not found',
    });
  }

  const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

  const session = await sessionModel.findOne({
    refreshTokenHash,
    revoked: false,
  });

  if (!session) {
    return res.status(400).json({
      success: false,
      message: 'Invalid refresh token',
    });
  }

  session.revoked = true;
  await session.save();

  res.clearCookie('refreshToken');

  return res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
}

export async function logoutAll(req: Request, res: Response) {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(400).json({
      success: false,
      message: 'Refresh token not found',
    });
  }

  const decoded = jwt.verify(refreshToken, config.JWT_SECRET);

  if (typeof decoded === 'string') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
    });
  }

  await sessionModel.updateMany(
    {
      userId: decoded.id,
      revoked: false,
    },
    {
      revoked: true,
    },
  );

  res.clearCookie('refreshToken');

  res.status(200).json({
    success: true,
    message: 'Logged out from all devices successfully',
  });
}
