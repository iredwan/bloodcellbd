import express from 'express';
import {
  UpsertWebsiteConfig,
  GetWebsiteConfig,
  UpdateContactInfo
} from '../controllers/WebsiteConfigControllers.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', GetWebsiteConfig);

// Protected routes (admin only)
router.post('/upsert', protect, restrictTo('admin'), UpsertWebsiteConfig);
router.put('/contact', protect, restrictTo('admin'), UpdateContactInfo);

export default router; 