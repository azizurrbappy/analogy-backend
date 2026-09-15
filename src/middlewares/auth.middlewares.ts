import { createRemoteJWKSet, jwtVerify } from 'jose';
import type { JWTPayload } from 'jose';
import type { Request, Response, NextFunction } from 'express';
import config from '../config/config.js';

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

const JWKS = createRemoteJWKSet(new URL(`${config.CLIENT_URL}/api/auth/jwks`));

const BASE_URL =
  config.CLIENT_URL ??
  (() => {
    throw new Error('BASE_URL env variable is not set');
  })();

export async function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided',
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Malformed authorization header',
      });
    }

    const { payload } = await jwtVerify(token, JWKS, {
      issuer: BASE_URL,
      audience: BASE_URL,
    });

    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
}
