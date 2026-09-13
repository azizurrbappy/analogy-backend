import { Router } from 'express';
import * as urlControllers from '../controllers/url.controllers.js';

const urlRouter = Router();

/**
 * Create Short URL
 * POST /api/urls
 */
urlRouter.post('/', urlControllers.createShortUrl);

/**
 * Get Original URL by Slug
 * GET /api/urls/:slug
 */
urlRouter.get('/:slug', urlControllers.getOriginalUrl);

export default urlRouter;
