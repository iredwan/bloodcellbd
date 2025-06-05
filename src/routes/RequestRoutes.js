import express from 'express';
import { 
  CreateRequest, 
  GetAllRequests, 
  GetRequestById, 
  UpdateRequest, 
  DeleteRequest, 
  GetFulfilledRequests, 
  GetUserRequests, 
  GetRequestsByBloodGroup, 
  ProcessRequest,
  FulfillRequest,
  GetAllRequestsForAdmin,
  GetProcessingRequest,
  GetRequestsFulfilledBy,
} from '../controllers/RequestControllers.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/all', GetAllRequests);
router.get('/get-fulfilled', GetFulfilledRequests);
router.get('/bloodgroup/:bloodGroup', GetRequestsByBloodGroup);
router.get('/all-requests-admin',protect, restrictTo('Admin','Divisional Coordinator'),GetAllRequestsForAdmin);
router.get('/get-processing-requests',protect, GetProcessingRequest);
router.get('/get-user-donate-history',protect, GetRequestsFulfilledBy);



// Protected routes (requires authentication)
router.get('/:id', GetRequestById);
router.post('/create', protect, CreateRequest);
router.patch('/update/:id', protect, UpdateRequest);
router.delete('/delete/:id', protect, DeleteRequest);
router.get('/user/requests', protect, GetUserRequests);
router.patch('/processing-by/:id', protect, ProcessRequest);
router.patch('/fulfill-by/:id', protect, FulfillRequest);


export default router; 