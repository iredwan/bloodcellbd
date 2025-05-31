import express from "express";
import { DecodeToken } from "../utility/TokenHelper.js";
import userModel from './../models/UserModel.js';
import RequestModel from "../models/RequestModel.js";

const router = express.Router();

router.get("/user-info", async (req, res) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(200).json({ status: false, message: "Please login" });
    }
    

    const decoded = DecodeToken(token);
    if (!decoded) {
      return res.status(401).json({ status: false, message: "Invalid or expired token" });
    }

    const user = await userModel.findById(decoded.id);
    if(user.role !== decoded.role){
      return res.status(401).json({ status: false, message: "Unauthorized" });
    }

    // User have a request? if user have a request, return true else false
    const userHaveRequest = await RequestModel.exists({ userId: decoded.id })
    .populate('userId','_id');

    // Is this user processing any requests? if processing a request, return true else false
    const processingRequest = await RequestModel.exists({ processingBy: decoded.id });


    return res.status(200).json({
      status: true,
      user: {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
        district: user.district || "",
        upazila: user.upazila || "",
        bloodGroup: user.bloodGroup || "",
        eligible : user.isEligible(),
        processingRequest: processingRequest? true : false,
        userHaveRequest: userHaveRequest,
      },
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: "Server error", error: error.message });
  }
});

export default router;
