import express from 'express';
import {
  UpsertWebsiteConfig,
  GetWebsiteConfig,
  deleteTopBanner
} from '../controllers/WebsiteConfigControllers.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/get', GetWebsiteConfig);

// Protected routes (admin only)
router.post('/upsert', protect, restrictTo('Admin', "Head of It & Media"), UpsertWebsiteConfig);

router.delete('/delete-top-banner', protect, restrictTo('Admin', "Head of It & Media"), deleteTopBanner);

export default router; 