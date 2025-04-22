import express from 'express';
import {
  CreateDistrict,
  GetAllDistricts
} from '../controllers/DistrictControllers.js';
import { protect, restrictTo } from '../middleware/auth.js';
const router = express.Router();

// District routes
router.post('/create', protect, restrictTo('admin'), CreateDistrict);
router.get('/all', GetAllDistricts);

export default router;
