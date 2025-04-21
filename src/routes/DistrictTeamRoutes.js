import express from 'express';
import {
  CreateDistrictTeam,
  GetAllDistrictTeam,
  GetDistrictTeamById,
  GetDistrictTeamByDistrict,
  UpdateDistrictTeam,
  DeleteDistrictTeam,
  ToggleDistrictTeamActive,
  ToggleDistrictTeamFeatured,
  UpdateDistrictTeamOrder
} from '../controllers/DistrictTeamControllers.js';
import { protect, restrictTo } from '../middleware/auth.js';
import { upload } from '../utility/fileUtils.js';

const router = express.Router();

// Public routes
router.get('/all', GetAllDistrictTeam);
router.get('/details/:id', GetDistrictTeamById);
router.get('/district/:district', GetDistrictTeamByDistrict);

// Protected routes (admin only)
router.post('/create', protect, restrictTo('admin'), upload.single('image'), CreateDistrictTeam);
router.put('/update/:id', protect, restrictTo('admin'), upload.single('image'), UpdateDistrictTeam);
router.delete('/delete/:id', protect, restrictTo('admin'), DeleteDistrictTeam);
router.patch('/toggle-active/:id', protect, restrictTo('admin'), ToggleDistrictTeamActive);
router.patch('/toggle-featured/:id', protect, restrictTo('admin'), ToggleDistrictTeamFeatured);
router.patch('/update-order/:id', protect, restrictTo('admin'), UpdateDistrictTeamOrder);

export default router; 