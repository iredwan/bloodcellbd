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

// Public routes
router.get('/all', GetAllSponsors);
router.get('/details/:id', GetSponsorById);
router.get('/type/:sponsorType', GetSponsorsByType);

// Protected routes (admin only)
router.post('/create', protect, restrictTo('admin'), CreateSponsor);
router.put('/update/:id', protect, restrictTo('admin'), UpdateSponsor);
router.delete('/delete/:id', protect, restrictTo('admin'), DeleteSponsor);
router.patch('/toggle-active/:id', protect, restrictTo('admin'), ToggleSponsorActive);
router.post('/add-event/:sponsorId/:eventId', protect, restrictTo('admin'), AddEventToSponsor);
router.delete('/remove-event/:sponsorId/:eventId', protect, restrictTo('admin'), RemoveEventFromSponsor);

export default router; 