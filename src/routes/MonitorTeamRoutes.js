import express from 'express';
import {
  CreateMonitorTeam,
  GetAllMonitorTeams,
  GetMonitorTeamById,
  UpdateMonitorTeam,
  DeleteMonitorTeam,
} from '../controllers/MonitorTeamControllers.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// Create a new monitor team (Admin only)
router.post('/create', protect, restrictTo('District Coordinator', 'District Sub-Coordinator', 'Upazila Coordinator', 'Upazila Sub-Coordinator',), CreateMonitorTeam);

// Get all monitor teams
router.get('/all', protect, GetAllMonitorTeams);

// Get monitor team by ID
router.get('/get/:id', protect, GetMonitorTeamById);

// Update monitor team (Admin only)
router.put('/update/:id', protect, restrictTo('District Coordinator', 'District Sub-Coordinator', 'Upazila Coordinator', 'Upazila Sub-Coordinator', 'Division Coordinator', 'Division Sub-Coordinator', 'Admin'), UpdateMonitorTeam);

// Delete monitor team (Admin only)
router.delete('/delete/:id', protect, restrictTo('District Coordinator', 'District Sub-Coordinator', 'Upazila Coordinator', 'Upazila Sub-Coordinator', 'Division Coordinator', 'Division Sub-Coordinator', 'Admin'), DeleteMonitorTeam);

export default router; 