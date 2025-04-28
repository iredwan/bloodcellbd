import express from 'express';
import {
  CreateSponsor,
  GetAllSponsors,
  GetSponsorById,
  UpdateSponsor,
  DeleteSponsor,
  GetSponsorsByType
} from '../controllers/SponsorControllers.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// Get all sponsors with optional filters (active, type, search, pagination)
router.get('/all', GetAllSponsors);

// Get sponsor details by ID
router.get('/get/:id', GetSponsorById);

// Get sponsors filtered by type (platinum, gold, silver, bronze, other)
router.get('/type/:sponsorType', GetSponsorsByType);


// Create a new sponsor
router.post('/create', protect, restrictTo('Admin'), CreateSponsor);

// Update an existing sponsor
router.put('/update/:id', protect, restrictTo('Admin'), UpdateSponsor);

// Delete a sponsor
router.delete('/delete/:id', protect, restrictTo('Admin'), DeleteSponsor);


export default router; 