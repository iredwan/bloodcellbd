import express from 'express';
import { GetAllDivisions } from '../controllers/DivisionControllers.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Get all divisions
router.get('/all', protect, GetAllDivisions);

export default router; 