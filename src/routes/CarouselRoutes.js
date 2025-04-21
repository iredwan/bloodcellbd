import express from 'express';
import { 
  CreateCarousel, 
  GetAllCarousel,
  GetCarouselById,
  UpdateCarousel, 
  DeleteCarousel
} from '../controllers/CarouselControllers.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/all', GetAllCarousel);

// Admin routes - protected and restricted to admin
router.post('/create', protect, restrictTo('admin'), CreateCarousel);
router.get('/:id', protect, restrictTo('admin'), GetCarouselById);
router.patch('/update/:id', protect, restrictTo('admin'), UpdateCarousel);
router.delete('/delete/:id', protect, restrictTo('admin'), DeleteCarousel);

export default router; 