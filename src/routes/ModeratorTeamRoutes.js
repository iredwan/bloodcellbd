import express from 'express';
import {
  CreateModeratorTeam,
  GetAllModeratorTeams,
  GetModeratorTeamById,
  UpdateModeratorTeam,
  DeleteModeratorTeam,
  AddTeamMember,
  RemoveTeamMember,
  GetModeratorTeamByModeratorUserId
} from '../controllers/ModeratorTeamControllers.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();
// Get all moderator teams
router.get('/all',protect, GetAllModeratorTeams);

// Get moderator team by ID
router.get('/get/:id', protect, GetModeratorTeamById);

// Get moderator team by moderator user ID
router.get('/get-by-moderator-user-id', protect, GetModeratorTeamByModeratorUserId);

// Create a new moderator team (Admin only)
router.post('/create', protect, restrictTo('Monitor', 'Upazila Coordinator', 'Upazila Sub-Coordinator', 'District Coordinator', 'District Sub-Coordinator', 'Admin'), CreateModeratorTeam);


// Update moderator team (Admin only)
router.put('/update/:id', protect, restrictTo('Monitor', 'Upazila Coordinator', 'Upazila Sub-Coordinator', 'District Coordinator', 'District Sub-Coordinator', 'Admin'), UpdateModeratorTeam);

// Delete moderator team (Admin only)
router.delete('/delete/:id', protect, restrictTo('Monitor', 'Upazila Coordinator', 'Upazila Sub-Coordinator', 'District Coordinator', 'District Sub-Coordinator', 'Admin'), DeleteModeratorTeam);

// Add member to team (Admin only)
router.post('/add-member/:teamId', protect, restrictTo('Moderator', 'Monitor', 'Upazila Coordinator', 'Upazila Sub-Coordinator', 'District Coordinator', 'District Sub-Coordinator', 'Admin'), AddTeamMember);

// Remove member from team (Admin only)
router.delete('/remove-member/:teamId', protect, restrictTo('Moderator', 'Monitor', 'Upazila Coordinator', 'Upazila Sub-Coordinator', 'District Coordinator', 'District Sub-Coordinator', 'Admin'), RemoveTeamMember);

export default router; 