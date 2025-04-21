import express from 'express';
import { GenerateOTP, VerifyOTP } from '../controllers/UserOTPControllers.js';

const router = express.Router();

// OTP Routes
router.post('/generate', GenerateOTP);
router.post('/verify', VerifyOTP);

export default router; 