import { Router } from 'express';
import * as authControllers from '../controllers/auth.controllers.js';
import { authenticate } from '../middlewares/auth.middlewares.js';

const authRouter = Router();

/**
 * POST /api/auth/check-username
 */
authRouter.post('/check-username', authControllers.checkUsername);

export default authRouter;
