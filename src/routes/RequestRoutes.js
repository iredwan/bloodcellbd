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
  RemoveProcessingBy,
  CancelRequest,
  RejectRequest,
  ResetRequest,
  SetVolunteerName,
  GetRequestsByVolunteerName,
  RemoveVolunteerName,
} from '../controllers/RequestControllers.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

router.get('/all', GetAllRequests);
router.get('/get-fulfilled', GetFulfilledRequests);
router.get('/bloodgroup/:bloodGroup', GetRequestsByBloodGroup);
router.get('/all-requests-admin',protect, restrictTo(
  'Head of IT & Media',
  'Head of Logistics', 
  'Admin'), GetAllRequestsForAdmin);
router.get('/get-processing-requests',protect, GetProcessingRequest);
router.get('/get-user-donate-history',protect, GetRequestsFulfilledBy);
router.get('/get-volunteer-requests', protect, GetRequestsByVolunteerName);



router.get('/:id', GetRequestById);
router.post('/create', protect, CreateRequest);
router.patch('/update/:id', protect, UpdateRequest);
router.delete('/delete/:id', protect, DeleteRequest);
router.get('/user/requests', protect, GetUserRequests);
router.patch('/processing-by/:id', protect, ProcessRequest);
router.patch('/remove-processing-by/:id', protect, RemoveProcessingBy);
router.patch('/fulfill-by/:id', protect, FulfillRequest);
router.patch('/cancel/:id', protect, CancelRequest);
router.patch('/reject/:id', protect, RejectRequest);
router.patch('/reset/:id', protect, restrictTo(
    'Admin', 
    "District Coordinator",
    "District Co-coordinator",
    "District IT & Media Coordinator",
    "District Logistics Coordinator", 
    "Upazila Coordinator",
    "Upazila Co-coordinator",
    "Upazila IT & Media Coordinator",
    "Upazila Logistics Coordinator", 
    "Head of IT & Media",
    "Head of Logistics",
  ), ResetRequest);

router.patch('/set-volunteer-name/:id', protect, SetVolunteerName);
router.patch('/remove-volunteer-name/:id', protect, RemoveVolunteerName);


export default router; 