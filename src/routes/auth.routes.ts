import { Router } from 'express';
import * as authControllers from '../controllers/auth.controllers.js';

const authRouter = Router();

/**
 * POST /api/auth/check-username
 */
authRouter.post('/check-username', authControllers.checkUsername);

export default authRouter;
