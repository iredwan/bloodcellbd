import express from 'express';
import { ProfileRegister, ProfileLogin, ProfileLogout, GetUserById, UpdateUserById, GetAllUser, EligibleUser, DeleteUser, GetUserByBloodGroup, GetUserByUpazila, GetPendingUser, GetApprovedUser, GetBannedUser, GetUserByDistrict, GetUserByName, GetUserByGmail } from '../controllers/UserControllers.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/login', ProfileLogin);
router.get('/logout', ProfileLogout);

// Protected routes
router.post('/register', protect, ProfileRegister);
router.get('/profile/:id', protect, GetUserById);
router.patch('/profile-update/:id', protect, UpdateUserById);
router.get('/eligible', protect, EligibleUser);
router.get('/bloodgroup/:bloodGroup', protect, GetUserByBloodGroup);
router.get('/upazila/:upazila', protect, GetUserByUpazila);
router.get('/district/:district', protect, GetUserByDistrict);

// Admin routes
router.get('/all', protect, restrictTo('admin'), GetAllUser);
router.get('/gmail/:email', protect, restrictTo('admin', 'dist-coordinator', 'volunteer'), GetUserByGmail);
router.get('/name/:name', protect, restrictTo('admin', 'dist-coordinator', 'volunteer'), GetUserByName);
router.get('/pending', protect, restrictTo('admin', 'dist-coordinator', 'volunteer'), GetPendingUser);
router.get('/approved', protect, restrictTo('admin', 'dist-coordinator', 'volunteer'), GetApprovedUser);
router.get('/banned', protect, restrictTo('admin', 'dist-coordinator'), GetBannedUser);
router.delete('/delete/:userId', protect, restrictTo('admin', 'dist-coordinator'), DeleteUser);

export default router;
