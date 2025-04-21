import { userOTPService, VerifyOTPService } from "../service/UserOTPService.js";

// Generate OTP for New User Registration
export const GenerateOTP = async (req, res) => {
  try {
    const result = await userOTPService(req);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ 
      status: false, 
      message: "Error generating OTP", 
      error: error.message 
    });
  }
};

// Verify OTP
export const VerifyOTP = async (req, res) => {
  try {
    const result = await VerifyOTPService(req, res);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ 
      status: false, 
      message: "Error verifying OTP", 
      error: error.message 
    });
  }
};
