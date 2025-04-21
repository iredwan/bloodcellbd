import UserModel from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import { EncodeToken } from "../utility/TokenHelper.js";
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;



export const UserRegisterService = async (req) => {
  try {
    let reqBody = req.body;
    
    // Check if user already exists
    const userExists = await UserModel.findOne({ email: reqBody.email });
    if (userExists) {
      return { status: false, message: "User with this email already exists." };
    }
    
    const newUser = new UserModel(reqBody);
    await newUser.save();
    return { status: true, message: "Register success." };
  } catch (e) {
    return { status: false, message: "There is problem to Register you.", details: e };
  }
};

export const UserLoginService = async (req, res) => {
  try {
    let reqBody = req.body;
    let email = reqBody.email;
    let password = reqBody.password;
    
    const user = await UserModel.findOne({ email: email }).select('+password');
    
    if (!user) {
      return { status: false, message: "User not found." };
    }
    
    // Check if user account is banned
    if (user.isBanned) {
      return { status: false, message: "Your account has been banned. Please contact support." };
    }
    
    let user_id = user.id;
    let role = user.role;
    
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return { status: false, message: "Incorrect password." };
    }

    let token = EncodeToken(email, user_id, role);
    
    // Set cookie
    // let options = {
    //   maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    //   httpOnly: false, // Prevents client-side access to the cookie
    //   sameSite: "none", // Required for cross-site cookies
    //   secure: true, // true in production
    // };

    // res.cookie("token", token, options);
    
    return {
      status: true,
      token: token,
      data: user,
      message: "Login success.",
    };
  } catch (e) {
    return { status: false, message: "Login failed.", details: e.message };
  }
};

export const UserLogoutService = async (req, res) => {
  try {
    // Clear the token cookie
    res.clearCookie('token', {
      httpOnly: false,
      sameSite: "none",
      secure: true
    });
    
    return {
      status: true,
      message: "Logout successful."
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Logout unsuccessful.", 
      details: e.message 
    };
  }
};

export const GetUserByIdService = async (req) => {
  try {
    const userId = new ObjectId(req.params.id);
    
    const user = await UserModel.findById(userId);
    
    if (!user) {
      return { status: false, message: "User not found." };
    }
    
    return {
      status: true,
      data: user,
      message: "User retrieved successfully.",
    };
  } catch (e) {
    return { status: false, message: "Failed to retrieve user.", details: e.message };
  }
};

export const UpdateUserByIdService = async (req) => {
  try {
    const userId = new ObjectId(req.params.id);
    const reqBody = req.body;

    // Check if avatar is being updated
    if (reqBody.avatar) {
      // Get the current user data to find the previous avatar
      const currentUser = await UserModel.findById(userId);
      
      // If user exists and has a previous avatar that is different from the new one
      if (currentUser && currentUser.avatar && currentUser.avatar !== reqBody.avatar) {
        // Delete the previous avatar file
        const deleteResult = await deleteFile(currentUser.avatar);
        if (!deleteResult.status) {
          console.error("Failed to delete previous user avatar:", deleteResult.error);
        }
      }
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $set: reqBody },
      { new: true, upsert: true }
    );

    return {
      status: true,
      data: updatedUser,
      message: "User updated successfully.",
    };
  } catch (e) {
    return { status: false, message: "Failed to update user.", details: e.message };
  }
};

export const GetAllUserService = async () => {
  try {
    const users = await UserModel.find({});
    
    if (!users || users.length === 0) {
      return { status: false, message: "No users found." };
    }
    
    return {
      status: true,
      data: users,
      message: "Users retrieved successfully.",
    };
  } catch (e) {
    return { status: false, message: "Failed to retrieve users.", details: e.message };
  }
};

export const EligibleUserService = async () => {
  try {
    // Find users who are eligible to donate blood
    const eligibleUsers = await UserModel.find({ 
      eligibility: true,
      isBanned: false,
      isApproved: true
    });
    
    if (!eligibleUsers || eligibleUsers.length === 0) {
      return { status: false, message: "No eligible users found." };
    }
    
    return {
      status: true,
      data: eligibleUsers,
      message: "Eligible users retrieved successfully.",
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to retrieve eligible users.", 
      details: e.message 
    };
  }
};

export const DeleteUserService = async (req) => {
  try {
    const userId = req.params.userId;
    
    if (!ObjectId.isValid(userId)) {
      return { status: false, message: "Invalid user ID format." };
    }

    const deletedUser = await UserModel.findByIdAndDelete(userId);
    
    if (!deletedUser) {
      return { status: false, message: "User not found or already deleted." };
    }
    
    return {
      status: true,
      message: "User deleted successfully.",
      data: deletedUser
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to delete user.", 
      details: e.message 
    };
  }
};

export const GetUserByBloodGroupService = async (req) => {
  try {
    const bloodGroup = req.params.bloodGroup;
    
    if (!bloodGroup) {
      return { status: false, message: "Blood group parameter is required." };
    }
    
    const users = await UserModel.find({ 
      bloodGroup: bloodGroup,
      isBanned: false,
      isApproved: true
    });
    
    if (!users || users.length === 0) {
      return { status: false, message: "No users found with the specified blood group." };
    }
    
    return {
      status: true,
      data: users,
      message: `Users with blood group ${bloodGroup} retrieved successfully.`,
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to retrieve users by blood group.", 
      details: e.message 
    };
  }
};

export const GetUserByUpazilaService = async (req) => {
  try {
    const upazila = req.params.upazila;
    
    if (!upazila) {
      return { status: false, message: "Upazila parameter is required." };
    }
    
    const users = await UserModel.find({ 
      upazila: upazila
    });
    
    if (!users || users.length === 0) {
      return { status: false, message: "No users found in the specified upazila." };
    }
    
    return {
      status: true,
      data: users,
      message: `Users in upazila ${upazila} retrieved successfully.`,
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to retrieve users by upazila.", 
      details: e.message 
    };
  }
};

export const GetUserByDistrictService = async (req) => {
  try {
    const district = req.params.district;
    
    if (!district) {
      return { status: false, message: "District parameter is required." };
    }
    
    const users = await UserModel.find({ 
      district: district
    });
    
    if (!users || users.length === 0) {
      return { status: false, message: "No users found in the specified district." };
    }
    
    return {
      status: true,
      data: users,
      message: `Users in district ${district} retrieved successfully.`,
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to retrieve users by district.", 
      details: e.message 
    };
  }
};

export const GetPendingUserService = async () => {
  try {
    const pendingUsers = await UserModel.find({ isApproved: false });
    
    if (!pendingUsers || pendingUsers.length === 0) {
      return { status: false, message: "No pending users found." };
    }
    
    return {
      status: true,
      data: pendingUsers,
      message: "Pending users retrieved successfully.",
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to retrieve pending users.", 
      details: e.message 
    };
  }
};

export const GetApprovedUserService = async () => {
  try {
    const approvedUsers = await UserModel.find({ isApproved: true });
    
    if (!approvedUsers || approvedUsers.length === 0) {
      return { status: false, message: "No approved users found." };
    }
    
    return {
      status: true,
      data: approvedUsers,
      message: "Approved users retrieved successfully.",
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to retrieve approved users.", 
      details: e.message 
    };
  }
};

export const GetBannedUserService = async () => {
  try {
    const bannedUsers = await UserModel.find({ isBanned: true });
    
    if (!bannedUsers || bannedUsers.length === 0) {
      return { status: false, message: "No banned users found." };
    }
    
    return {
      status: true,
      data: bannedUsers,
      message: "Banned users retrieved successfully.",
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to retrieve banned users.", 
      details: e.message 
    };
  }
};

export const GetUserByNameService = async (req) => {
  try {
    const { name } = req.params;
    
    // Using regex for case-insensitive partial name search
    const users = await UserModel.find({ 
      name: { $regex: name, $options: 'i' },
      eligibility: true,
      isApproved: true,
      isBanned: false
    });
    
    if (!users || users.length === 0) {
      return { 
        status: false, 
        message: "No users found with the given name." 
      };
    }
    
    return {
      status: true,
      data: users,
      message: "Users retrieved successfully.",
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to retrieve users by name.", 
      details: e.message 
    };
  }
};















