import { Router } from 'express';
import * as mailControllers from '../controllers/mail.controllers.js';

const mailRouter = Router();

/**
 * POST /api/mail/send-mail
 */
mailRouter.post('/send-mail', mailControllers.sendMail);

export default mailRouter;
