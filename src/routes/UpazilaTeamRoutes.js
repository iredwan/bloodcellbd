import express from 'express';
import {
  CreateUpazilaTeam,
  GetAllUpazilaTeams,
  GetUpazilaTeamById,
  UpdateUpazilaTeam,
  DeleteUpazilaTeam,
  GetUpazilaTeamByUpazilaCoordinatorsUserId
} from '../controllers/UpazilaTeamControllers.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// Get all upazila teams
router.get('/all', GetAllUpazilaTeams);

// Get upazila team by ID
router.get('/get/:id', GetUpazilaTeamById);

// Get upazila team by upazila coordinators user ID
router.get('/get-by-upazila-coordinators-user-id', protect, GetUpazilaTeamByUpazilaCoordinatorsUserId);

// Create a new upazila team
router.post('/create', protect, restrictTo('District Coordinator', 'District Co-coordinator', 'Division Coordinator', 'Division Co-coordinator', 'Admin'), CreateUpazilaTeam);

// Update upazila team
router.put('/update/:id', protect, restrictTo('District Coordinator', 'District Co-coordinator', 'Division Coordinator', 'Division Co-coordinator', 'Admin'), UpdateUpazilaTeam);

// Delete upazila team
router.delete('/delete/:id', protect, restrictTo('District Coordinator', 'District Co-coordinator', 'Division Coordinator', 'Division Co-coordinator', 'Admin'), DeleteUpazilaTeam);


export default router; 