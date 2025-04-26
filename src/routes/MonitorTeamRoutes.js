import express from 'express';
import {
  CreateMonitorTeam,
  GetAllMonitorTeams,
  GetMonitorTeamById,
  GetMonitorTeamsByModeratorTeam,
  UpdateMonitorTeam,
  DeleteMonitorTeam,
  ChangeTeamMonitor
} from '../controllers/MonitorTeamControllers.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// Create a new monitor team (Admin and District Coordinator only)
router.post('/create', CreateMonitorTeam);

// Get all monitor teams
router.get('/all', GetAllMonitorTeams);

// Get monitor team by ID
router.get('/get/:id', protect, GetMonitorTeamById);

// Get monitor teams by moderator team ID
router.get('/by-moderator-team/:moderatorTeamId', protect, GetMonitorTeamsByModeratorTeam);

// Update monitor team (Admin and District Coordinator only)
router.put('/update/:id', protect, restrictTo('admin', 'dist-coordinator'), UpdateMonitorTeam);

// Delete monitor team (Admin and District Coordinator only)
router.delete('/delete/:id', protect, restrictTo('admin', 'dist-coordinator'), DeleteMonitorTeam);

// Change team monitor (Admin and District Coordinator only)
router.put('/change-monitor/:teamId/:newMonitorId', protect, restrictTo('admin', 'dist-coordinator'), ChangeTeamMonitor);

export default router; 