import express from 'express';
import {
  CreateDivisionalTeam,
  GetAllDivisionalTeam,
  GetDivisionalTeamById,
  GetDivisionalTeamByDivision,
  UpdateDivisionalTeam,
  DeleteDivisionalTeam,
  ToggleDivisionalTeamActive,
  ToggleDivisionalTeamFeatured,
  UpdateDivisionalTeamOrder
} from '../controllers/DivisionalTeamControllers.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/all', GetAllDivisionalTeam);
router.get('/details/:id', GetDivisionalTeamById);
router.get('/division/:division', GetDivisionalTeamByDivision);

// Protected routes (admin only)
router.post('/create', protect, restrictTo('admin'), CreateDivisionalTeam);
router.put('/update/:id', protect, restrictTo('admin'), UpdateDivisionalTeam);
router.delete('/delete/:id', protect, restrictTo('admin'), DeleteDivisionalTeam);
router.patch('/toggle-active/:id', protect, restrictTo('admin'), ToggleDivisionalTeamActive);
router.patch('/toggle-featured/:id', protect, restrictTo('admin'), ToggleDivisionalTeamFeatured);
router.patch('/update-order/:id', protect, restrictTo('admin'), UpdateDivisionalTeamOrder);

export default router; 