import express from 'express';
import { 
  CreateCarousel, 
  GetAllCarousel,
  GetCarouselById,
  UpdateCarousel, 
  DeleteCarousel,
  GetActiveCarousel
} from '../controllers/CarouselControllers.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/active', GetActiveCarousel);
// Admin routes - protected and restricted to admin
router.get('/all',protect, restrictTo('Head of IT & Media', 'Admin'), GetAllCarousel);
router.post('/create', protect, restrictTo('Head of IT & Media', 'Admin'), CreateCarousel);
router.get('/:id', protect, restrictTo('Head of IT & Media', 'Admin'), GetCarouselById);
router.patch('/update/:id', protect, restrictTo('Head of IT & Media', 'Admin'), UpdateCarousel);
router.delete('/delete/:id', protect, restrictTo('Head of IT & Media', 'Admin'), DeleteCarousel);

export default router; 