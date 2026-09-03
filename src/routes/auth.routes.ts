import { Router } from 'express';
import * as authControllers from '../controllers/auth.controllers.js';

const authRouter = Router();

/**
 * POST /api/auth/signup
 */
authRouter.post('/signup', authControllers.signup);

/**
 * POST /api/auth/login
 */
authRouter.post('/login', authControllers.login);

/**
 * get /api/auth/get-me
 */
authRouter.get('/get-me', authControllers.getMe);

/**
 * get /api/auth/refresh-token
 */
authRouter.get('/refresh-token', authControllers.refreshToken);

/**
 * get /api/auth/logout
 */
authRouter.get('/logout', authControllers.logout);

/**
 * get /api/auth/logout-all
 */
authRouter.get('/logout-all', authControllers.logoutAll);

export default authRouter;
