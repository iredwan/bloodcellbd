import express from 'express';
import {
  CreateGoodwillAmbassador,
  GetAllGoodwillAmbassadors,
  GetGoodwillAmbassadorById,
  UpdateGoodwillAmbassador,
  DeleteGoodwillAmbassador,
  GetGoodwillAmbassadorsByDesignation
} from '../controllers/GoodwillAmbassadorControllers.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

/**
 * Public Routes - No authentication required
 */

// Get all goodwill ambassadors with optional filters
router.get('/all', GetAllGoodwillAmbassadors);

// Get goodwill ambassador details by ID
router.get('/details/:id', GetGoodwillAmbassadorById);

// Get goodwill ambassadors by designation (Goodwill Ambassador or Honorable Member)
router.get('/designation/:designation', GetGoodwillAmbassadorsByDesignation);


// Create a new goodwill ambassador
router.post('/create', protect, CreateGoodwillAmbassador);

// Update an existing goodwill ambassador
router.put('/update/:id', protect, restrictTo('Admin'), UpdateGoodwillAmbassador);

// Delete a goodwill ambassador
router.delete('/delete/:id', protect, restrictTo('Admin'), DeleteGoodwillAmbassador);

export default router; 