import express from 'express';
import {
  UpsertWebsiteConfig,
  GetWebsiteConfig,
} from '../controllers/WebsiteConfigControllers.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/get', GetWebsiteConfig);

// Protected routes (admin only)
router.post('/upsert', protect, restrictTo('Admin', "Head of It & Media"), UpsertWebsiteConfig);

export default router; 