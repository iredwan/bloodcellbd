import UserModel from "../models/UserModel.js";
import UserOTPModel from "../models/UserOTPModel.js";
import SendEmail from "../utility/emailUtility.js";
import { EncodeToken } from "../utility/TokenHelper.js";




export const userOTPService = async(req) =>{
  try {
      let email = req.body.email;
      let role = "user";
      let user

      const existingUser = await UserModel.find({ email: email });

      if (existingUser.length > 0) {
          return { status: false, message: "User exists" };
      }
      
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      // Set OTP expiry (current time + 2 minutes)
      let otpExpiry = new Date();
      otpExpiry.setMinutes(otpExpiry.getMinutes() + 2); // Expires in 2 mins

    
      user = await UserOTPModel.findOneAndUpdate(
          { email: email },
          { otp, role, otpExpiry: otpExpiry},
          { upsert: true, new: true }
        );
        
        
        await SendEmail(email.trim(), `Your OTP is ${otp} It will expire in 2 minutes`, "BloodCellBD OTP Verification");
      
  
      return { status: true, message: `OTP Send to ${email}` };
    } catch (error) {
      return { status: false, message: "Failed to send OTP", details: error.message };
    }
}


export const VerifyOTPService = async(req, res) =>{

  try {
    let { email, otp } = req.body;

    if (!email || !otp) {
        return { status: "false", message: "Email and OTP are required" };
    }

    // Find the user
    let user = await UserOTPModel.findOne({ email: email.trim() });
 
  
    if (!user || !user.otp) {
        return { status: "false", message: "Invalid OTP" };
    }

    // Check if OTP is expired
    let currentTime = new Date();
    if (user.otpExpiry && user.otpExpiry < currentTime) {
        return { status: "false", message: "OTP has expired. Please request a new one." };
    }

    // Check if OTP matches
    if (user.otp !== otp) {
        return { status: "false", message: "Incorrect OTP" };
    }

    let token = EncodeToken(email, user._id.toString(), user.role);
    
    // OTP is correct → Clear OTP fields after successful verification
    await UserOTPModel.updateOne(
        { email: email.trim() },
        { $unset: { otp: "", otpExpiry: "" } }
    );
    
    return {
      status: true,
      token: token,
      data: user[0],
      message: "OTP verified successfully.",
    };

  } catch (e) {
      return {status: false, message: "Invalid OTP1", details: e.message}
  }
}