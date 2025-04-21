import express from 'express';
import { 
  CreateEvent, 
  GetAllEvents, 
  GetEventById, 
  UpdateEvent, 
  DeleteEvent, 
  UpdateEventStatus, 
  GetEventsByOrganizer, 
  GetUpcomingEvents 
} from '../controllers/EventControllers.js';
import { protect, restrictTo } from '../middleware/auth.js';
import { upload } from '../utility/fileUtils.js';

const router = express.Router();

// Public routes
router.get('/all', GetAllEvents);
router.get('/upcoming', GetUpcomingEvents);
router.get('/:id', GetEventById);

// Protected routes (for authenticated users)
router.get('/organizer/events', protect, GetEventsByOrganizer);
router.get('/organizer/:organizerId', protect, GetEventsByOrganizer);

// Admin and Organizer routes
router.post('/create', protect, restrictTo('admin', 'volunteer', 'dist-coordinator'), upload.single('image'), CreateEvent);
router.patch('/update/:id', protect, upload.single('image'), UpdateEvent);
router.delete('/delete/:id', protect, DeleteEvent);
router.patch('/status/:id', protect, UpdateEventStatus);

export default router; 