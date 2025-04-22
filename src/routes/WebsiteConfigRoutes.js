import express from 'express';
import {
  UpsertWebsiteConfig,
  GetWebsiteConfig,
  UpdateContactInfo,
  UpdateSocialMedia,
  UpdateAboutUs,
  UpdateMetaTags,
  ToggleMaintenanceMode,
  UpdateAnalyticsCode
} from '../controllers/WebsiteConfigControllers.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', GetWebsiteConfig);

// Protected routes (admin only)
router.post('/upsert', protect, restrictTo('admin'), UpsertWebsiteConfig);
router.put('/contact', protect, restrictTo('admin'), UpdateContactInfo);
router.put('/social-media', protect, restrictTo('admin'), UpdateSocialMedia);
router.put('/about-us', protect, restrictTo('admin'), UpdateAboutUs);
router.put('/meta-tags', protect, restrictTo('admin'), UpdateMetaTags);
router.patch('/maintenance-mode', protect, restrictTo('admin'), ToggleMaintenanceMode);
router.put('/analytics', protect, restrictTo('admin'), UpdateAnalyticsCode);

export default router; 