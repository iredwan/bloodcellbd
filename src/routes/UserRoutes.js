import express from 'express';
import { ProfileRegister, ProfileLogin, ProfileLogout, ProfileRegisterWithRef, GetUserById, UpdateUserByIdSelf, UpdateUserByIdRef, GetAllUser, EligibleUser, DeleteUser, GetUserByBloodGroup, GetUserByUpazila, GetPendingUser, GetApprovedUser, GetBannedUser, GetUserByDistrict, GetUserByName, GetUserByNIDOrBirthRegistration, GetAllUserForAdmin, GetUserByUserId } from '../controllers/UserControllers.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/login', ProfileLogin);
router.post('/logout', ProfileLogout);
router.get('/profile/:id', GetUserById);
router.patch('/profile-update/:id', protect, UpdateUserByIdSelf);
router.get('/eligible', protect, EligibleUser);
router.get('/bloodgroup/:bloodGroup', protect, GetUserByBloodGroup);
router.get('/upazila/:upazila', protect, GetUserByUpazila);
router.get('/district/:district', protect, GetUserByDistrict);
router.get('/all', protect, GetAllUser);
router.get('/profile-by-user-id', protect, GetUserByUserId);

// Protected routes
router.post('/register', ProfileRegister);

router.post('/register-with-ref', protect, restrictTo('Moderator', 'Monitor', 'Upazila Coordinator', 'Upazila Co-coordinator', 'Upazila IT & Media Coordinator', 'Upazila Logistics Coordinator', 'District Coordinator', 'District Co-coordinator', 'District IT & Media Coordinator', 'District Logistics Coordinator', 'Division Coordinator', 'Division Co-coordinator', "Head of IT & Media", "Head of Logistics", 'Admin'), ProfileRegisterWithRef);

router.patch('/profile-update-ref/:id', protect, restrictTo('Moderator', 'Monitor', 'Upazila Coordinator', 'Upazila Co-coordinator', 'Upazila IT & Media Coordinator', 'Upazila Logistics Coordinator', 'District Coordinator', 'District Co-coordinator', 'District IT & Media Coordinator', 'District Logistics Coordinator', 'Division Coordinator', 'Division Co-coordinator', "Head of IT & Media", "Head of Logistics", 'Admin'), UpdateUserByIdRef);

router.get('/all-for-admin', protect, restrictTo('Moderator', 'Monitor', 'Upazila Coordinator', 'Upazila Co-coordinator', 'Upazila IT & Media Coordinator', 'Upazila Logistics Coordinator', 'District Coordinator', 'District Co-coordinator', 'District IT & Media Coordinator', 'District Logistics Coordinator', 'Division Coordinator', 'Division Co-coordinator', "Head of IT & Media", "Head of Logistics", 'Admin'), GetAllUserForAdmin);

router.get('/nid-or-birth-registration/:nidOrBirthRegistration', protect, restrictTo('Moderator', 'Monitor', 'Upazila Coordinator', 'Upazila Co-coordinator', 'Upazila IT & Media Coordinator', 'Upazila Logistics Coordinator', 'District Coordinator', 'District Co-coordinator', 'District IT & Media Coordinator', 'District Logistics Coordinator', 'Division Coordinator', 'Division Co-coordinator', "Head of IT & Media", "Head of Logistics", 'Admin'), GetUserByNIDOrBirthRegistration);

router.get('/name/:name', protect, restrictTo('Moderator', 'Monitor', 'Upazila Coordinator', 'Upazila Co-coordinator', 'Upazila IT & Media Coordinator', 'Upazila Logistics Coordinator', 'District Coordinator', 'District Co-coordinator', 'District IT & Media Coordinator', 'District Logistics Coordinator', 'Division Coordinator', 'Division Co-coordinator', "Head of IT & Media", "Head of Logistics", 'Admin'), GetUserByName);

router.get('/pending', protect, restrictTo('Moderator', 'Monitor', 'Upazila Coordinator', 'Upazila Co-coordinator', 'Upazila IT & Media Coordinator', 'Upazila Logistics Coordinator', 'District Coordinator', 'District Co-coordinator', 'District IT & Media Coordinator', 'District Logistics Coordinator', 'Division Coordinator', 'Division Co-coordinator', "Head of IT & Media", "Head of Logistics", 'Admin'), GetPendingUser);

router.get('/approved', protect, restrictTo('Moderator', 'Monitor', 'Upazila Coordinator', 'Upazila Co-coordinator', 'Upazila IT & Media Coordinator', 'Upazila Logistics Coordinator', 'District Coordinator', 'District Co-coordinator', 'District IT & Media Coordinator', 'District Logistics Coordinator', 'Division Coordinator', 'Division Co-coordinator', "Head of IT & Media", "Head of Logistics", 'Admin'), GetApprovedUser);

router.get('/banned', protect, restrictTo('District Coordinator', 'District Co-coordinator', 'District IT & Media Coordinator', 'District Logistics Coordinator', 'Division Coordinator', 'Division Co-coordinator', "Head of IT & Media", "Head of Logistics", 'Admin'), GetBannedUser);

router.delete('/delete/:userId', protect, restrictTo('District Coordinator', 'District Co-coordinator', 'District IT & Media Coordinator', 'District Logistics Coordinator', 'Division Coordinator', 'Division Co-coordinator', "Head of IT & Media", "Head of Logistics", 'Admin'), DeleteUser);

export default router;
