import express from 'express';
import {
  CreateDistrictTeam,
  GetAllDistrictTeams,
  GetDistrictTeamById,
  UpdateDistrictTeam,
  DeleteDistrictTeam
} from '../controllers/DistrictTeamControllers.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// Create a new district team
router.post('/create', protect, restrictTo('District Coordinator', 'District Sub-Coordinator', 'Division Coordinator', 'Division Sub-Coordinator', 'Admin'), CreateDistrictTeam);

// Get all district teams
router.get('/all', protect, GetAllDistrictTeams);

// Get district team by ID
router.get('/get/:id', protect, GetDistrictTeamById);

// Update district team
router.put('/update/:id', protect, restrictTo('District Coordinator', 'District Sub-Coordinator', 'Division Coordinator', 'Division Sub-Coordinator', 'Admin'), UpdateDistrictTeam);

// Delete district team
router.delete('/delete/:id', protect, restrictTo('District Coordinator', 'District Sub-Coordinator', 'Division Coordinator', 'Division Sub-Coordinator', 'Admin'), DeleteDistrictTeam);

export default router; 