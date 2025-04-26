import express from 'express';
import { ProfileRegister, ProfileLogin, ProfileLogout, ProfileRegisterWithRef, GetUserById, UpdateUserByIdSelf, UpdateUserByIdRef, GetAllUser, EligibleUser, DeleteUser, GetUserByBloodGroup, GetUserByUpazila, GetPendingUser, GetApprovedUser, GetBannedUser, GetUserByDistrict, GetUserByName, GetUserByNIDOrBirthRegistration, GetAllUserForAdmin } from '../controllers/UserControllers.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/login', ProfileLogin);
router.get('/logout', ProfileLogout);
router.get('/profile/:id', protect, GetUserById);
router.patch('/profile-update/:id', protect, UpdateUserByIdSelf);
router.get('/eligible', protect, EligibleUser);
router.get('/bloodgroup/:bloodGroup', protect, GetUserByBloodGroup);
router.get('/upazila/:upazila', protect, GetUserByUpazila);
router.get('/district/:district', protect, GetUserByDistrict);
router.get('/all', protect, GetAllUser);

// Protected routes
router.post('/register', protect, ProfileRegister);

router.post('/register-with-ref', protect, restrictTo('Moderator', 'Monitor', 'Upazila Coordinator', 'Upazila Sub-Coordinator', 'Upazila IT & Media Coordinator', 'Upazila Logistics Coordinator', 'District Coordinator', 'District Sub-Coordinator', 'District IT & Media Coordinator', 'District Logistics Coordinator', 'Division Coordinator', 'Division Sub-Coordinator', 'Admin'), ProfileRegisterWithRef);

router.patch('/profile-update-ref/:id', protect, restrictTo('Moderator', 'Monitor', 'Upazila Coordinator', 'Upazila Sub-Coordinator', 'Upazila IT & Media Coordinator', 'Upazila Logistics Coordinator', 'District Coordinator', 'District Sub-Coordinator', 'District IT & Media Coordinator', 'District Logistics Coordinator', 'Division Coordinator', 'Division Sub-Coordinator', 'Admin'), UpdateUserByIdRef);

router.get('/all-for-admin', protect, restrictTo('Moderator', 'Monitor', 'Upazila Coordinator', 'Upazila Sub-Coordinator', 'Upazila IT & Media Coordinator', 'Upazila Logistics Coordinator', 'District Coordinator', 'District Sub-Coordinator', 'District IT & Media Coordinator', 'District Logistics Coordinator', 'Division Coordinator', 'Division Sub-Coordinator', 'Admin'), GetAllUserForAdmin);

router.get('/nid-or-birth-registration/:nidOrBirthRegistration', protect, restrictTo('Moderator', 'Monitor', 'Upazila Coordinator', 'Upazila Sub-Coordinator', 'Upazila IT & Media Coordinator', 'Upazila Logistics Coordinator', 'District Coordinator', 'District Sub-Coordinator', 'District IT & Media Coordinator', 'District Logistics Coordinator', 'Division Coordinator', 'Division Sub-Coordinator', 'Admin'), GetUserByNIDOrBirthRegistration);

router.get('/name/:name', protect, restrictTo('Moderator', 'Monitor', 'Upazila Coordinator', 'Upazila Sub-Coordinator', 'Upazila IT & Media Coordinator', 'Upazila Logistics Coordinator', 'District Coordinator', 'District Sub-Coordinator', 'District IT & Media Coordinator', 'District Logistics Coordinator', 'Division Coordinator', 'Division Sub-Coordinator', 'Admin'), GetUserByName);

router.get('/pending', protect, restrictTo('Moderator', 'Monitor', 'Upazila Coordinator', 'Upazila Sub-Coordinator', 'Upazila IT & Media Coordinator', 'Upazila Logistics Coordinator', 'District Coordinator', 'District Sub-Coordinator', 'District IT & Media Coordinator', 'District Logistics Coordinator', 'Division Coordinator', 'Division Sub-Coordinator', 'Admin'), GetPendingUser);

router.get('/approved', protect, restrictTo('Moderator', 'Monitor', 'Upazila Coordinator', 'Upazila Sub-Coordinator', 'Upazila IT & Media Coordinator', 'Upazila Logistics Coordinator', 'District Coordinator', 'District Sub-Coordinator', 'District IT & Media Coordinator', 'District Logistics Coordinator', 'Division Coordinator', 'Division Sub-Coordinator', 'Admin'), GetApprovedUser);

router.get('/banned', protect, restrictTo('Moderator', 'Monitor', 'Upazila Coordinator', 'Upazila Sub-Coordinator', 'Upazila IT & Media Coordinator', 'Upazila Logistics Coordinator', 'District Coordinator', 'District Sub-Coordinator', 'District IT & Media Coordinator', 'District Logistics Coordinator', 'Division Coordinator', 'Division Sub-Coordinator', 'Admin'), GetBannedUser);

router.delete('/delete/:userId', protect, restrictTo('District Coordinator', 'District Sub-Coordinator', 'District IT & Media Coordinator', 'District Logistics Coordinator', 'Division Coordinator', 'Division Sub-Coordinator', 'Admin'), DeleteUser);

export default router;
