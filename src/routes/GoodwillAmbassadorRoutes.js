import express from 'express';
import {
  CreateGoodwillAmbassador,
  GetAllGoodwillAmbassadors,
  GetGoodwillAmbassadorById,
  UpdateGoodwillAmbassador,
  DeleteGoodwillAmbassador,
  ToggleGoodwillAmbassadorActive,
  ToggleGoodwillAmbassadorFeatured,
  AddEventToGoodwillAmbassador,
  RemoveEventFromGoodwillAmbassador
} from '../controllers/GoodwillAmbassadorControllers.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/all', GetAllGoodwillAmbassadors);
router.get('/details/:id', GetGoodwillAmbassadorById);

// Protected routes (admin only)
router.post('/create', protect, restrictTo('admin'), CreateGoodwillAmbassador);
router.put('/update/:id', protect, restrictTo('admin'), UpdateGoodwillAmbassador);
router.delete('/delete/:id', protect, restrictTo('admin'), DeleteGoodwillAmbassador);
router.patch('/toggle-active/:id', protect, restrictTo('admin'), ToggleGoodwillAmbassadorActive);
router.patch('/toggle-featured/:id', protect, restrictTo('admin'), ToggleGoodwillAmbassadorFeatured);
router.post('/add-event/:ambassadorId/:eventId', protect, restrictTo('admin'), AddEventToGoodwillAmbassador);
router.delete('/remove-event/:ambassadorId/:eventId', protect, restrictTo('admin'), RemoveEventFromGoodwillAmbassador);

export default router; 