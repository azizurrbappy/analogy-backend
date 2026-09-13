import type { Request, Response } from 'express';
import urlModel from '../models/url.model.js';

/**
 * Create Short URL
 * POST /api/urls
 */
export async function createShortUrl(req: Request, res: Response) {
  try {
    const { originalUrl, slug } = req.body;

    // Validation
    if (!originalUrl || !slug) {
      res.status(400).json({
        success: false,
        message: 'Original URL and Slug is required',
      });
      return;
    }

    // URL validation
    try {
      new URL(originalUrl);
    } catch {
      res.status(400).json({
        success: false,
        message: 'Please provide a valid URL',
      });
      return;
    }

    // Create URL document
    const newUrl = await urlModel.create({
      originalUrl,
      slug,
    });

    return res.status(201).json({
      success: true,
      message: 'Short URL created successfully',
      data: newUrl,
    });
  } catch (err) {
    console.error('Create Short URL Error:', err);

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}

/**
 * Redirect / Get Original URL
 * GET /api/urls/:slug
 */
export async function getOriginalUrl(req: Request, res: Response) {
  try {
    const { slug } = req.params;

    if (!slug) {
      res.status(400).json({
        success: false,
        message: 'Slug is required',
      });
      return;
    }

    const url = await urlModel.findOneAndUpdate(
      { slug },
      { $inc: { clicks: 1 } },
      {
        returnDocument: 'after',
      },
    );

    if (!url) {
      res.status(404).json({
        success: false,
        message: 'Short URL not found',
      });
      return;
    }

    return res.status(200).json({
      success: true,
      data: {
        originalUrl: url.originalUrl,
        slug: url.slug,
        clicks: url.clicks,
      },
    });
  } catch (err) {
    console.error('Get Original URL Error:', err);

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}
