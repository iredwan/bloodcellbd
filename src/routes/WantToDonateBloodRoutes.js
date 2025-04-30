import express from 'express';
import {
  CreateWantToDonateBlood,
  GetAllWantToDonateBlood,
  GetWantToDonateBloodById,
  UpdateWantToDonateBlood,
  DeleteWantToDonateBlood,
  UpdateBloodCollectedBy,
  GetWantToDonateBloodByUserId
} from '../controllers/WantToDonateBloodControllers.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// Public routes - none for this resource
router.get('/all', GetAllWantToDonateBlood);
router.get('/get/:id', GetWantToDonateBloodById);

// Protected routes - require login
router.post('/create', protect, CreateWantToDonateBlood);
router.put('/update/:id', protect, UpdateWantToDonateBlood);
router.get('/user', protect, GetWantToDonateBloodByUserId);
router.put('/update-blood-collected-by/:id', protect, UpdateBloodCollectedBy);
router.delete('/delete/:id', protect, DeleteWantToDonateBlood);

export default router; 