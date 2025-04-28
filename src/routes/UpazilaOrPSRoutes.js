import express from 'express';
import {
  CreateUpazilaOrPS,
  GetUpazilasOrPSByDistrict,
  GetAllUpazilaOrPS
} from '../controllers/UpazilaOrPSControllers.js';
import { protect, restrictTo } from '../middleware/auth.js';
const router = express.Router();

// Get all Upazila/PS
router.get('/all', GetAllUpazilaOrPS);

// Get Upazila/PS by district
router.get('/by-district/:districtId', GetUpazilasOrPSByDistrict);

// Upazila or Police Station routes
router.post('/create', protect, restrictTo('admin'), CreateUpazilaOrPS);

export default router;
