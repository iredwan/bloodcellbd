import express from 'express';
import {
  CreateBoardTeam,
  GetAllBoardTeam,
  GetBoardTeamById,
  UpdateBoardTeam,
  DeleteBoardTeam,
  ToggleBoardTeamActive,
  ToggleBoardTeamFeatured,
  UpdateBoardTeamOrder
} from '../controllers/BoardTeamControllers.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/all', GetAllBoardTeam);
router.get('/details/:id', GetBoardTeamById);

// Protected routes (admin only)
router.post('/create', protect, restrictTo('admin'), CreateBoardTeam);
router.put('/update/:id', protect, restrictTo('admin'), UpdateBoardTeam);
router.delete('/delete/:id', protect, restrictTo('admin'), DeleteBoardTeam);
router.patch('/toggle-active/:id', protect, restrictTo('admin'), ToggleBoardTeamActive);
router.patch('/toggle-featured/:id', protect, restrictTo('admin'), ToggleBoardTeamFeatured);
router.patch('/update-order/:id', protect, restrictTo('admin'), UpdateBoardTeamOrder);

export default router; 