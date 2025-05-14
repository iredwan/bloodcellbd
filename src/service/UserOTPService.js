import UserModel from "../models/UserModel.js";
import UserOTPModel from "../models/UserOTPModel.js";
import SendEmail from "../utility/emailUtility.js";
import { EncodeToken } from "../utility/TokenHelper.js";

// export const userOTPService = async(req) =>{
//   try {
//       let email = req.body.email;
//       let role = "user";
//       let user

//       const existingUser = await UserModel.find({ email: email });

//       if (existingUser.length > 0) {
//           return { status: false, message: "User exists" };
//       }

//       const otp = Math.floor(100000 + Math.random() * 900000).toString();

//       // Set OTP expiry (current time + 2 minutes)
//       let otpExpiry = new Date();
//       otpExpiry.setMinutes(otpExpiry.getMinutes() + 2); // Expires in 2 mins

//       user = await UserOTPModel.findOneAndUpdate(
//           { email: email },
//           { otp, role, otpExpiry: otpExpiry},
//           { upsert: true, new: true }
//         );

//         await SendEmail(email.trim(), `Your OTP is ${otp} It will expire in 2 minutes`, "BloodCellBD OTP Verification");

//       return { status: true, message: `OTP Send to ${email}` };
//     } catch (error) {
//       return { status: false, message: "Failed to send OTP", details: error.message };
//     }
// }

export const userOTPService = async (req) => {
  try {
    const email = req.body.email?.trim();

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return { status: false, message: "Invalid email" };
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return { status: false, message: "User already exists" };
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Set OTP expiry (2 minutes)
    const otpExpiry = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes from now

    // Save or update OTP for this email
    await UserOTPModel.findOneAndUpdate(
      { email },
      { otp, role: "user", otpExpiry },
      { upsert: true, new: true }
    );

    // Send email
    await SendEmail(
      email,
      `Your OTP is ${otp}. It will expire in 2 minutes.`,
      "BloodCellBD OTP Verification"
    );

    return { 
      status: true, 
      message: `OTP sent to ${email}` 
    };
  } catch (error) {
    console.error("OTP sending failed:", error.message);
    return {
      status: false,
      message: "Failed to send OTP",
      error: error.message
    };
  }
};





export const VerifyOTPService = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return { status: false, message: "Email and OTP are required" };
    }

    const user = await UserOTPModel.findOne({ email: email.trim() });

    if (!user || !user.otp) {
      return { status: false, message: "Invalid OTP" };
    }

    // Brute-force prevention: limit attempts
    if (user.otpAttempts >= 5) {
      return { status: false, message: "Too many incorrect attempts. Try again later." };
    }

    // Expiry check
    if (user.otpExpiry < new Date()) {
      return { status: false, message: "OTP expired" };
    }

    // OTP match check
    if (user.otp !== otp) {
      await UserOTPModel.updateOne(
        { email: email.trim() },
        { $inc: { otpAttempts: 1 } } // Increase attempt count
      );
      return { status: false, message: "Incorrect OTP" };
    }

    // Success: reset otpAttempts & set token cookie
    const token = EncodeToken(user.email, user._id.toString(), user.role || "user");


    await UserOTPModel.updateOne(
      { email: email.trim() },
      { $unset: { otp: "", otpExpiry: "" }, $set: { otpAttempts: 0 } } // Clear OTP and reset attempts
    );

    return {
      status: true,
      token: token,
      message: "OTP verified successfully",
    };

  } catch (error) {
    return {
      status: false,
      message: "OTP verification failed",
      error: error.message,
    };
  }
};
