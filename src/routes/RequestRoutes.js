import express from 'express';
import { 
  CreateRequest, 
  GetAllRequests, 
  GetRequestById, 
  UpdateRequest, 
  DeleteRequest, 
  GetPendingRequests, 
  GetFulfilledRequests, 
  GetUserRequests, 
  GetRequestsByBloodGroup, 
  FulfillRequest
} from '../controllers/RequestControllers.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/all', GetAllRequests);
router.get('/pending', GetPendingRequests);
router.get('/fulfilled', GetFulfilledRequests);
router.get('/bloodgroup/:bloodGroup', GetRequestsByBloodGroup);
router.get('/:id', GetRequestById);

// Protected routes (requires authentication)
router.post('/create', protect, CreateRequest);
router.patch('/update/:id', protect, UpdateRequest);
router.delete('/delete/:id', protect, DeleteRequest);
router.get('/user/requests', protect, GetUserRequests);
router.patch('/fulfill-by/:id', protect, FulfillRequest);


export default router; 