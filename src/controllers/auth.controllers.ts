import type { Request, Response } from 'express';
import userModel from '../models/user.model.js';

/* ============================================================
   Check Username
============================================================ */

export async function checkUsername(req: Request, res: Response) {
  try {
    const { username } = req.body;

    // Basic Validation
    if (!username) {
      return res.status(400).json({
        success: false,
        message: 'Username is required',
      });
    }

    // Normalize Input
    const normalizedUsername = username.toLowerCase().trim();

    // Find existing username
    const usernameExist = await userModel
      .findOne({ username: normalizedUsername })
      .select('_id username');

    if (usernameExist) {
      return res.status(200).json({
        success: false,
        message: 'Username already exists',
        data: { id: usernameExist._id, username: usernameExist.username },
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Username is available',
    });
  } catch (error) {
    console.error('Username Check Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}
