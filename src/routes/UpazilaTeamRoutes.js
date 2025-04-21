import express from 'express';
import {
  CreateUpazilaTeam,
  GetAllUpazilaTeam,
  GetUpazilaTeamById,
  GetUpazilaTeamByDistrict,
  GetUpazilaTeamByUpazila,
  UpdateUpazilaTeam,
  DeleteUpazilaTeam,
  ToggleUpazilaTeamActive,
  ToggleUpazilaTeamFeatured,
  UpdateUpazilaTeamOrder
} from '../controllers/UpazilaTeamControllers.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/all', GetAllUpazilaTeam);
router.get('/details/:id', GetUpazilaTeamById);
router.get('/district/:district', GetUpazilaTeamByDistrict);
router.get('/upazila/:upazila', GetUpazilaTeamByUpazila);

// Protected routes (admin only)
router.post('/create', protect, restrictTo('admin'), CreateUpazilaTeam);
router.put('/update/:id', protect, restrictTo('admin'), UpdateUpazilaTeam);
router.delete('/delete/:id', protect, restrictTo('admin'), DeleteUpazilaTeam);
router.patch('/toggle-active/:id', protect, restrictTo('admin'), ToggleUpazilaTeamActive);
router.patch('/toggle-featured/:id', protect, restrictTo('admin'), ToggleUpazilaTeamFeatured);
router.patch('/update-order/:id', protect, restrictTo('admin'), UpdateUpazilaTeamOrder);

export default router; 