import express from 'express';
import {
  CreateSponsor,
  GetAllSponsors,
  GetSponsorById,
  UpdateSponsor,
  DeleteSponsor,
  ToggleSponsorActive,
  AddEventToSponsor,
  RemoveEventFromSponsor,
  GetSponsorsByType
} from '../controllers/SponsorControllers.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

/**
 * Public Routes - No authentication required
 */

// Get all sponsors with optional filters (active, type, search, pagination)
router.get('/all', GetAllSponsors);

// Get sponsor details by ID
router.get('/get/:id', GetSponsorById);

// Get sponsors filtered by type (platinum, gold, silver, bronze, other)
router.get('/type/:sponsorType', GetSponsorsByType);

/**
 * Protected Routes - Admin authentication required
 */

// Create a new sponsor
router.post('/create', protect, CreateSponsor);

// Update an existing sponsor
router.put('/update/:id', protect, UpdateSponsor);

// Delete a sponsor
router.delete('/delete/:id', protect, DeleteSponsor);

// Toggle active status (activate/deactivate)
router.patch('/toggle-active/:id', protect, ToggleSponsorActive);

// Manage sponsor-event relationships
router.post('/event/:sponsorId/:eventId', protect, restrictTo('Admin'), AddEventToSponsor);
router.delete('/event/:sponsorId/:eventId', protect, restrictTo('Admin'), RemoveEventFromSponsor);

export default router; 