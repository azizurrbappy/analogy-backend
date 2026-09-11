import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/user.model.js';
import sessionModel from '../models/session.model.js';
import config from '../config/config.js';
import { hashToken, generateAccessToken, generateRefreshToken } from '../utils/token.utils.js';
import { setRefreshTokenCookie, clearRefreshTokenCookie } from '../utils/cookie.utils.js';

const SALT_ROUNDS = 10;

/* ============================================================
   Registration
============================================================ */

export async function registration(req: Request, res: Response) {
  try {
    const { fullName, username, email, phoneNumber, password } = req.body;

    // Basic Validation
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required',
      });
    }

    // Normalize Input
    const normalizedUsername = username.toLowerCase().trim();

    const normalizedEmail = email ? email.toLowerCase().trim() : undefined;

    const normalizedPhoneNumber = phoneNumber ? phoneNumber.trim() : undefined;

    // Check Existing User
    const conditions: any[] = [
      {
        username: normalizedUsername,
      },
    ];

    if (normalizedEmail) {
      conditions.push({
        email: normalizedEmail,
      });
    }

    if (normalizedPhoneNumber) {
      conditions.push({
        phoneNumber: normalizedPhoneNumber,
      });
    }

    const userExist = await userModel.findOne({
      $or: conditions,
    });

    if (userExist) {
      return res.status(409).json({
        success: false,
        message: 'Username, email or phone number already exists',
      });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Create User
    const user = await userModel.create({
      fullName,
      username: normalizedUsername,
      email: normalizedEmail,
      phoneNumber: normalizedPhoneNumber,
      password: hashedPassword,
    });

    // Generate Refresh Token
    const refreshToken = generateRefreshToken(user._id.toString());

    const refreshTokenHash = hashToken(refreshToken);

    // Create Session
    await sessionModel.create({
      userId: user._id,
      refreshTokenHash,
      ip: req.ip ?? 'unknown',
      userAgent: req.headers['user-agent'] ?? 'unknown',
    });

    // Generate Access Token
    const accessToken = generateAccessToken(user._id.toString());

    // Set Refresh Cookie
    setRefreshTokenCookie(res, refreshToken);

    // Response
    return res.status(201).json({
      success: true,
      message: 'User signup successful',

      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
      },

      accessToken,
    });
  } catch (error) {
    console.error('Signup Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}

/* ============================================================
   LOGIN
============================================================ */

export async function login(req: Request, res: Response) {
  try {
    const { username, email, phoneNumber, password } = req.body;

    // Validation
    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required',
      });
    }

    // Build Search Conditions
    const searchConditions: any[] = [];

    if (username) {
      searchConditions.push({
        username: username.toLowerCase().trim(),
      });
    }

    if (email) {
      searchConditions.push({
        email: email.toLowerCase().trim(),
      });
    }

    if (phoneNumber) {
      searchConditions.push({
        phoneNumber: phoneNumber.trim(),
      });
    }

    if (searchConditions.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Username, email or phone number is required',
      });
    }

    // Find User
    const user = await userModel
      .findOne({
        $or: searchConditions,
      })
      .select('+password');

    // Check User
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Compare Password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Generate Refresh Token
    const refreshToken = generateRefreshToken(user._id.toString());

    const refreshTokenHash = hashToken(refreshToken);

    // Create Session
    await sessionModel.create({
      userId: user._id,
      refreshTokenHash,
      ip: req.ip ?? 'unknown',
      userAgent: req.headers['user-agent'] ?? 'unknown',
    });

    // Generate Access Token
    const accessToken = generateAccessToken(user._id.toString());

    // Set Cookie
    setRefreshTokenCookie(res, refreshToken);

    // Response
    return res.status(200).json({
      success: true,
      message: 'Login successful',

      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
      },

      accessToken,
    });
  } catch (error) {
    console.error('Login Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}

/* ============================================================
   GET ME
============================================================ */

export async function getMe(req: Request, res: Response) {
  try {
    const authHeader = req.headers.authorization;

    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized access',
      });
    }

    // Verify Access Token
    const decoded = jwt.verify(token, config.JWT_SECRET) as jwt.JwtPayload;

    if (!decoded?.id) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
      });
    }

    // Find User
    const user = await userModel.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'User fetched successfully',
      data: user,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
}

/* ============================================================
   REFRESH TOKEN
============================================================ */

export async function refreshToken(req: Request, res: Response) {
  try {
    const oldRefreshToken = req.cookies.refreshToken;

    if (!oldRefreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized access',
      });
    }

    // Verify Refresh Token
    const decoded = jwt.verify(oldRefreshToken, config.JWT_SECRET) as jwt.JwtPayload;

    if (!decoded?.id) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token',
      });
    }

    // Find Session
    const oldRefreshTokenHash = hashToken(oldRefreshToken);

    const session = await sessionModel.findOne({
      userId: decoded.id,
      refreshTokenHash: oldRefreshTokenHash,
      revoked: false,
    });

    if (!session) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or revoked refresh token',
      });
    }

    // Find User
    const user = await userModel.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Generate New Access Token
    const accessToken = generateAccessToken(user._id.toString());

    // Refresh Token Rotation
    const newRefreshToken = generateRefreshToken(user._id.toString());

    const newRefreshTokenHash = hashToken(newRefreshToken);

    session.refreshTokenHash = newRefreshTokenHash;

    await session.save();

    // Set New Cookie
    setRefreshTokenCookie(res, newRefreshToken);

    return res.status(200).json({
      success: true,
      message: 'Access token refreshed successfully',
      accessToken,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired refresh token',
    });
  }
}

/* ============================================================
   LOGOUT
============================================================ */

export async function logout(req: Request, res: Response) {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token not found',
      });
    }

    // Hash Refresh Token
    const refreshTokenHash = hashToken(refreshToken);

    // Find Session
    const session = await sessionModel.findOne({
      refreshTokenHash,
      revoked: false,
    });

    if (!session) {
      clearRefreshTokenCookie(res);

      return res.status(400).json({
        success: false,
        message: 'Invalid refresh token',
      });
    }

    // Revoke Session
    session.revoked = true;

    await session.save();

    // Clear Cookie
    clearRefreshTokenCookie(res);

    return res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Logout Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}

/* ============================================================
   LOGOUT ALL DEVICES
============================================================ */

export async function logoutAll(req: Request, res: Response) {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token not found',
      });
    }

    // Verify Refresh Token
    const decoded = jwt.verify(refreshToken, config.JWT_SECRET) as jwt.JwtPayload;

    if (!decoded?.id) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token',
      });
    }

    // Revoke All Sessions
    await sessionModel.updateMany(
      {
        userId: decoded.id,
        revoked: false,
      },
      {
        $set: {
          revoked: true,
        },
      },
    );

    // Clear Cookie
    clearRefreshTokenCookie(res);

    return res.status(200).json({
      success: true,
      message: 'Logged out from all devices successfully',
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired refresh token',
    });
  }
}
