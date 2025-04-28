import express from 'express';
import {
  CreateDivisionalTeam,
  GetAllDivisionalTeams,
  GetDivisionalTeamById,
  UpdateDivisionalTeam,
  DeleteDivisionalTeam
} from '../controllers/DivisionalTeamControllers.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// Get all divisional teams
router.get('/all', protect, GetAllDivisionalTeams);
// Get divisional team by ID
router.get('/get/:id', protect, GetDivisionalTeamById);

// Create a new divisional team
router.post('/create', protect, restrictTo('Admin'), CreateDivisionalTeam);

// Update divisional team
router.put('/update/:id', protect, restrictTo('Admin'), UpdateDivisionalTeam);

// Delete divisional team
router.delete('/delete/:id', protect, restrictTo('Admin'), DeleteDivisionalTeam);

export default router; 