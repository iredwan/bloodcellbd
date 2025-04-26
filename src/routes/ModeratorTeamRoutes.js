import express from 'express';
import {
  CreateModeratorTeam,
  GetAllModeratorTeams,
  GetModeratorTeamById,
  UpdateModeratorTeam,
  DeleteModeratorTeam,
  AddTeamMember,
  RemoveTeamMember
} from '../controllers/ModeratorTeamControllers.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// Create a new moderator team (Admin only)
router.post('/create', CreateModeratorTeam);

// Get all moderator teams
router.get('/all', GetAllModeratorTeams);

// Get moderator team by ID
router.get('/get/:id', GetModeratorTeamById);

// Update moderator team (Admin only)
router.put('/update/:id', protect, restrictTo('admin', 'dist-coordinator'), UpdateModeratorTeam);

// Delete moderator team (Admin only)
router.delete('/delete/:id', protect, restrictTo('admin', 'dist-coordinator'), DeleteModeratorTeam);

// Add member to team (Admin only)
router.post('/add-member/:teamId/:memberId', protect, restrictTo('admin', 'dist-coordinator', 'volunteer'), AddTeamMember);

// Remove member from team (Admin only)
router.delete('/remove-member/:teamId/:memberId', protect, restrictTo('admin', 'dist-coordinator', 'volunteer'), RemoveTeamMember);

export default router; 