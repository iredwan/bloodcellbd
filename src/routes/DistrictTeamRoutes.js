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

// Get all district teams
router.get('/all', protect, GetAllDistrictTeams);
// Get district team by ID
router.get('/get/:id', protect, GetDistrictTeamById);


// Create a new district team
router.post('/create', protect, restrictTo('Divisional Coordinator', 'Divisional Sub-Coordinator', 'Admin'), CreateDistrictTeam);

// Update district team
router.put('/update/:id', protect, restrictTo('Divisional Coordinator', 'Divisional Sub-Coordinator', 'Admin'), UpdateDistrictTeam);

// Delete district team
router.delete('/delete/:id', protect, restrictTo('Divisional Coordinator', 'Divisional Sub-Coordinator', 'Admin'), DeleteDistrictTeam);

export default router; 