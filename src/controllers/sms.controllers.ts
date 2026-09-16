import type { Request, Response } from 'express';
import { sendBulkSms, sendGateSms } from '../services/sms.services.js';

export async function sendSms(req: Request, res: Response) {
  try {
    const { provider, phoneNumber, message } = req.body;

    if (provider === 'bulk') {
      await sendBulkSms(phoneNumber, message);

      return res.status(200).json({
        success: true,
        message: 'SMS send successfully',
      });
    }

    if (provider === 'gate') {
      await sendGateSms(phoneNumber, message);

      return res.status(200).json({
        success: true,
        message: 'SMS send successfully',
      });
    }

    return res.status(404).json({
      success: false,
      message: 'SMS provider not found',
    });
  } catch (error) {
    console.error('Send sms error:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}
