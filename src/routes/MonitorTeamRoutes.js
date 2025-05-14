import express from 'express';
import {
  CreateMonitorTeam,
  GetAllMonitorTeams,
  GetMonitorTeamById,
  UpdateMonitorTeam,
  DeleteMonitorTeam,
  GetMonitorTeamByMonitorUserId,
} from '../controllers/MonitorTeamControllers.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// Get all monitor teams
router.get('/all', GetAllMonitorTeams);

// Get monitor team by ID
router.get('/get/:id', GetMonitorTeamById);

// Get monitor team by monitor user ID
router.get('/get-by-monitor-user-id', protect, GetMonitorTeamByMonitorUserId);

// Create a new monitor team (Admin only)
router.post('/create', protect, restrictTo('Upazila Coordinator', 'Upazila Co-coordinator','District Coordinator', 'District Co-coordinator', 'Admin'), CreateMonitorTeam);

// Update monitor team (Admin only)
router.put('/update/:id', protect, restrictTo('Upazila Coordinator', 'Upazila Co-coordinator','District Coordinator', 'District Co-coordinator', 'Admin'), UpdateMonitorTeam);

// Delete monitor team (Admin only)
router.delete('/delete/:id', protect, restrictTo('Upazila Coordinator', 'Upazila Co-coordinator','District Coordinator', 'District Co-coordinator', 'Admin'), DeleteMonitorTeam);

export default router; 