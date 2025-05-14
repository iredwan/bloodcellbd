import express from "express";
import { DecodeToken } from "../utility/TokenHelper.js";
import userModel from './../models/UserModel.js';

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

    return res.status(200).json({
      status: true,
      user: {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: "Server error", error: error.message });
  }
});

export default router;
