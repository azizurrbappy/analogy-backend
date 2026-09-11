import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import config from '../config/config.js';

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function generateAccessToken(userId: string): string {
  return jwt.sign(
    {
      id: userId,
    },
    config.JWT_SECRET,
    {
      expiresIn: '15m',
    },
  );
}

export function generateRefreshToken(userId: string): string {
  return jwt.sign(
    {
      id: userId,
    },
    config.JWT_SECRET,
    {
      expiresIn: '7d',
    },
  );
}
