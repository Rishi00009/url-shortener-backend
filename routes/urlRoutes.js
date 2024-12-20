import express from 'express';
import { shortenUrl, redirectUrl } from '../controllers/urlController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/shorten', protect, shortenUrl); // Use middleware to protect this route
router.get('/:shortUrl', redirectUrl); // Redirect to the original URL

export default router;
