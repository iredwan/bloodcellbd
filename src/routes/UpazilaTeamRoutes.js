import express from 'express';
import {
  CreateUpazilaTeam,
  GetAllUpazilaTeams,
  GetUpazilaTeamById,
  UpdateUpazilaTeam,
  DeleteUpazilaTeam
} from '../controllers/UpazilaTeamControllers.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// Get all upazila teams
router.get('/all', protect, GetAllUpazilaTeams);

// Get upazila team by ID
router.get('/get/:id', protect, GetUpazilaTeamById);

// Create a new upazila team
router.post('/create', protect, restrictTo('District Coordinator', 'District Sub-Coordinator', 'Division Coordinator', 'Division Sub-Coordinator', 'Admin'), CreateUpazilaTeam);

// Update upazila team
router.put('/update/:id', protect, restrictTo('District Coordinator', 'District Sub-Coordinator', 'Division Coordinator', 'Division Sub-Coordinator', 'Admin'), UpdateUpazilaTeam);

// Delete upazila team
router.delete('/delete/:id', protect, restrictTo('District Coordinator', 'District Sub-Coordinator', 'Division Coordinator', 'Division Sub-Coordinator', 'Admin'), DeleteUpazilaTeam);


export default router; 