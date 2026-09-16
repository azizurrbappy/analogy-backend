import { Router } from 'express';
import * as smsControllers from '../controllers/sms.controllers.js';

const smsRouter = Router();

/**
 * POST /api/sms/send-sms
 */
smsRouter.post('/send-sms', smsControllers.sendSms);

export default smsRouter;
