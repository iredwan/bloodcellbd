import express from 'express';
import {
  CreateModeratorTeam,
  GetAllModeratorTeams,
  GetModeratorTeamById,
  UpdateModeratorTeam,
  DeleteModeratorTeam,
  AddTeamMember,
  RemoveTeamMember,
  GetModeratorTeamByModeratorUserId,
  GetAllModeratorTeamsByMonitorUserId,
  GetModeratorTeamByMemberUserId
} from '../controllers/ModeratorTeamControllers.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();
// Get all moderator teams
router.get('/all', GetAllModeratorTeams);

// Get moderator team by ID
router.get('/get/:id', GetModeratorTeamById);

// Get moderator team by moderator user ID
router.get('/get-by-moderator-user-id', protect, GetModeratorTeamByModeratorUserId);

// Get all moderator teams by monitor user ID
router.get('/get-all-by-monitor-user-id', protect, GetAllModeratorTeamsByMonitorUserId);

// Get moderator teams by member user ID
router.get('/get-by-member-user-id', protect, GetModeratorTeamByMemberUserId);

// Create a new moderator team (Admin only)
router.post('/create', protect, restrictTo('Monitor', 'Upazila Coordinator', 'Upazila Co-coordinator', 'District Coordinator', 'District Co-coordinator', 'Admin'), CreateModeratorTeam);


// Update moderator team (Admin only)
router.put('/update/:id', protect, restrictTo('Monitor', 'Upazila Coordinator', 'Upazila Co-coordinator', 'District Coordinator', 'District Co-coordinator', 'Admin'), UpdateModeratorTeam);

// Delete moderator team (Admin only)
router.delete('/delete/:id', protect, restrictTo('Monitor', 'Upazila Coordinator', 'Upazila Co-coordinator', 'District Coordinator', 'District Co-coordinator', 'Admin'), DeleteModeratorTeam);

// Add member to team (Admin only)
router.post('/add-member/:teamId', protect, restrictTo('Moderator', 'Monitor', 'Upazila Coordinator', 'Upazila Co-coordinator', 'District Coordinator', 'District Co-coordinator', 'Admin'), AddTeamMember);

// Remove member from team (Admin only)
router.delete('/remove-member/:teamId', protect, restrictTo('Moderator', 'Monitor', 'Upazila Coordinator', 'Upazila Co-coordinator', 'District Coordinator', 'District Co-coordinator', 'Admin'), RemoveTeamMember);

export default router; 