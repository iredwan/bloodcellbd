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
router.get('/get/:id', GetBoardTeamById);

// Protected routes (admin only)
router.post('/create',protect, restrictTo('Admin'), CreateBoardTeam);
router.put('/update/:id', protect, restrictTo('Admin'), UpdateBoardTeam);
router.delete('/delete/:id', protect, restrictTo('Admin'), DeleteBoardTeam);
router.patch('/toggle-active/:id', protect, restrictTo('Admin'), ToggleBoardTeamActive);
router.patch('/toggle-featured/:id', protect, restrictTo('Admin'), ToggleBoardTeamFeatured);
router.patch('/update-order/:id', protect, restrictTo('Admin'), UpdateBoardTeamOrder);

export default router; 