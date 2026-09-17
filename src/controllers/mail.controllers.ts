import type { Request, Response } from 'express';
import { cloudflareMail } from '../services/mail.services.js';

export async function sendMail(req: Request, res: Response) {
  const { to, subject, body } = req.body;

  if (!to || !subject || !body) {
    return res.status(400).json({
      success: false,
      message: 'To, Subject and Body is required',
    });
  }

  try {
    await cloudflareMail(to, subject, body);

    return res.status(200).json({
      success: true,
      message: 'Mail send successfully',
    });
  } catch (error) {
    console.error('Username Check Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}
