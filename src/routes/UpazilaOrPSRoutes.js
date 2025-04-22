import express from 'express';
import {
  CreateUpazilaOrPS,
  GetUpazilasOrPSByDistrict
} from '../controllers/UpazilaOrPSControllers.js';
import { protect, restrictTo } from '../middleware/auth.js';
const router = express.Router();

// Upazila or Police Station routes
router.post('/create', protect, restrictTo('admin'), CreateUpazilaOrPS);
router.get('/by-district/:districtId', GetUpazilasOrPSByDistrict);

export default router;
