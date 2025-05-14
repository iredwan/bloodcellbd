import express from 'express';
import { GenerateOTP, VerifyOTP } from '../controllers/UserOTPControllers.js';
import { otpRateLimiter } from './../middleware/rateLimiter.js';

const router = express.Router();

// OTP Routes
router.post('/generate', GenerateOTP);
router.post('/verify',otpRateLimiter, VerifyOTP);

export default router; 