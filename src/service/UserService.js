import UserModel from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import { EncodeToken } from "../utility/TokenHelper.js";
import mongoose from "mongoose";
import { deleteFile } from "../utility/fileUtils.js";
const ObjectId = mongoose.Types.ObjectId;

export const UserRegisterService = async (req, res) => {
  try {
    const reqBody = req.body;

    const userExists = await UserModel.findOne({
      identificationNumber: reqBody.identificationNumber,
    });
    if (userExists) {
      return {
        status: false,
        message: `User with this ${reqBody.identificationType} already exists.`,
      };
    }

    const newUser = new UserModel(reqBody);
    await newUser.save();

    return {
      status: true,
      message: "Register success.",
    };

  } catch (e) {
    return {
      status: false,
      message: "There was a problem registering you.",
      error: e.details,
    };
  }
};


export const UserRegisterWithRefService = async (req) => {
  try {
    let reqBody = req.body;

    // Get reference ID from headers or cookies
    let referenceId =
      req.headers.user_id || (req.cookies && req.cookies.user_id);

    // Check if reference user exists
    if (referenceId) {
      if (!ObjectId.isValid(referenceId)) {
        return { status: false, message: "Invalid reference user ID." };
      }

      const referenceUser = await UserModel.findById(referenceId);
      if (!referenceUser) {
        return { status: false, message: "Reference user not found." };
      }

      // Add reference to request body
      reqBody.reference = referenceId;
    }


    // Check if user already exists
    const userExists = await UserModel.findOne({
      identificationNumber: reqBody.identificationNumber,
    });
    if (userExists) {
      return {
        status: false,
        message: `User with this ${reqBody.identificationType} already exists.`,
      };
    }

    const newUser = new UserModel(reqBody);
    await newUser.save();
    return { status: true, message: "Register with reference success." };
  } catch (e) {
    return {
      status: false,
      message: "There is problem registering you with reference.",
      details: e.message,
    };
  }
};

export const UserLoginService = async (req, res) => {
  try {
    let reqBody = req.body;
    let email = reqBody.email;
    let password = reqBody.password;

    const user = await UserModel.findOne({ email: email }).select("+password");

    if (!user) {
      return { status: false, message: "User not found." };
    }

    // Check if user account is banned
    if (user.isBanned) {
      return {
        status: false,
        message: "Your account has been banned. Please contact support.",
      };
    }

    let user_id = user.id;
    let role = user.role;

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return { status: false, message: "Incorrect password." };
    }

    let token = EncodeToken(email, user_id, role);

    // Set the token cookie
    res.cookie("token", token, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      // sameSite: "Strict",
      secure: false,
      sameSite: "Lax",
      maxAge: 2592000000, // 30 days
      path: "/",
    });

   
    return {
      status: true,
      message: "Login success.",
    };
  } catch (e) {
    return { status: false, message: "Login failed.", details: e.message };
  }
};

export const UserLogoutService = async (req, res) => {
  try {
    // Clear the token cookie
    res.clearCookie("token", {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      // sameSite: "Strict",
      secure: false,
      sameSite: "Lax",
      maxAge: 2592000000, // 30 days
      path: "/",
    });

    return {
      status: true,
      message: "Logout successful.",
    };
  } catch (e) {
    return {
      status: false,
      message: "Logout unsuccessful.",
      details: e.message,
    };
  }
};

export const UpdateUserByIdSelfService = async (req) => {
  try {
    const userId = new ObjectId(req.params.id);
    const reqBody = req.body;

    // Check if avatar is being updated
    // if (reqBody.avatar) {
    //   // Get the current user data to find the previous avatar
    //   const currentUser = await UserModel.findById(userId);

    //   // If user exists and has a previous avatar that is different from the new one
    //   if (currentUser && currentUser.avatar && currentUser.avatar !== reqBody.avatar) {
    //     // Delete the previous avatar file
    //     const deleteResult = await deleteFile(currentUser.avatar);
    //     if (!deleteResult.status) {
    //       console.error("Failed to delete previous user avatar:", deleteResult.error);
    //     }
    //   }
    // }

    //Set isApproved to false
    reqBody.isApproved = false;

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $set: reqBody },
      { new: true, upsert: true }
    );

    return {
      status: true,
      data: updatedUser,
      message: "User updated successfully. Please wait for approval.",
    };
  } catch (e) {
    return {
      status: false,
      message: "Failed to update user.",
      details: e.message,
    };
  }
};


export const UpdateUserByIdRefService = async (req) => {
  try {
    const userId = new ObjectId(req.params.id);
    const reqBody = req.body;

    // Get reference ID from headers or cookies
    const referenceId =
      req.headers.user_id || (req.cookies && req.cookies.user_id);

    if (!referenceId) {
      return { status: false, message: "Reference ID is required." };
    }

    if (!ObjectId.isValid(referenceId)) {
      return { status: false, message: "Invalid reference user ID." };
    }

    const referenceUser = await UserModel.findById(referenceId);
    if (!referenceUser) {
      return { status: false, message: "Reference user not found." };
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return { status: false, message: "User not found." };
    }

    // Admin role permission checks
    if (reqBody.role === "admin" && referenceUser.role !== "admin") {
      return {
        status: false,
        message: "Only admin users can update admin roles.",
      };
    }

    if (user.role === "admin" && referenceUser.role !== "admin") {
      return {
        status: false,
        message: "Only admin users can modify admin users.",
      };
    }

    // Handle profile image update
    if (
      reqBody.profileImage &&
      user.profileImage &&
      reqBody.profileImage !== user.profileImage
    ) {
      const deleteResult = await deleteFile(user.profileImage);
      if (!deleteResult.status) {
        console.error(
          "Failed to delete previous profile image:",
          deleteResult.error
        );
      }
    }

    // Update user
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        $set: {
          ...reqBody,
          updatedBy: referenceId,
        },
      },
      { new: true }
    );

    return {
      status: true,
      data: updatedUser,
      message: "User updated successfully.",
    };
  } catch (e) {
    return {
      status: false,
      message: "Failed to update user.",
      details: e.message,
    };
  }
};


//only eligible, approved, not banned users
export const GetAllUserService = async (req, res) => {
  try {
    const reqBody = req.body;

    const {
      bloodGroup,
      district,
      upazila,
      search,
      page = 1,
      limit = 10,
    } = reqBody;

    const skip = (page - 1) * limit;

    // Eligibility Threshold Date (90 days ago)
    const eligibilityDate = new Date();
    eligibilityDate.setDate(eligibilityDate.getDate() - 90);
    const eligibilityThreshold = eligibilityDate.toLocaleDateString('en-GB'); // DD/MM/YYYY format


    // Base query
    const baseQuery = {
      isApproved: true,
      isBanned: false,
      $or: [
        { lastDonate: { $exists: false } },
        { lastDonate: { $lt: eligibilityThreshold } },
      ],
    };

    // Optional filters
    if (bloodGroup) {
      baseQuery.bloodGroup = bloodGroup;
    }

    if (district) {
      baseQuery.district = district;
    }

    if (upazila) {
      baseQuery.upazila = upazila;
    }

    // Search (name, email, phone)
    if (search) {
      const regex = new RegExp(search, "i");
      const searchConditions = [
        { name: regex },
        { email: regex },
        { phone: regex },
      ];

      // Merge search with existing $or using $and
      baseQuery.$and = [{ $or: baseQuery.$or }, { $or: searchConditions }];
      delete baseQuery.$or;
    }

    // Query execution
    const users = await UserModel.find(baseQuery)
      .select("-nidOrBirthRegistrationImage -dob -identificationNumber -identificationType -religion -occupation -fatherName -fatherPhoneNumber -motherName -motherPhoneNumber -isApproved -isBanned -password -reference -updatedBy -createdAt -updatedAt")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    if (users.length === 0) {
      return {
        status: false,
        message: "No eligible users found in your desired location.",
      };
    }

    const totalUsers = await UserModel.countDocuments(baseQuery);

    return {
      status: true,
      data: {
        users,
        pagination: {
          totalUsers,
          currentPage: page,
          totalPages: Math.ceil(totalUsers / limit),
        },
      },
      message: "Eligible users retrieved successfully.",
    };
  } catch (e) {
    return {
      status: false,
      message: "Failed to retrieve users.",
      details: e.message,
    };
  }
};

export const GetUserByIdService = async (req) => {
  try {
    const userId = new ObjectId(req.params.id);

    const user = await UserModel.findById(userId).select(
      "-password"
    );

    if (!user) {
      return { status: false, message: "User not found." };
    }

    let userData = user.toObject();

    // Check if reference is an ObjectId
    if (userData.reference && userData.reference !== "Self") {
      const referenceUser = await UserModel.findById(userData.reference).select(
        "name phone isVerified bloodGroup lastDonate nextDonationDate role roleSuffix profileImage"
      );

      if (referenceUser) {
        userData.reference = referenceUser;
      }
    } else {
      userData.reference = "Self";
    }

    //UpdateBy user data
    if (userData.updatedBy) {
      const updatedByUser = await UserModel.findById(userData.updatedBy).select(
        "name phone isVerified bloodGroup lastDonate nextDonationDate role roleSuffix profileImage"
      );

      if (updatedByUser) {
        userData.updatedBy = updatedByUser;
      }
    }

    return {
      status: true,
      data: userData,
      message: "User retrieved successfully.",
    };
  } catch (e) {
    return {
      status: false,
      message: "Failed to retrieve user.",
      details: e.message,
    };
  }
};

//Get User By User ID Service
export const GetUserByUserIdService = async (req) => {
  try {
    const userId = req.headers.user_id || req.cookies.user_id;
    const user = await UserModel.findById(userId)
      .select("-nidOrBirthRegistrationImage -dob -identificationNumber -identificationType -religion -occupation -fatherName -fatherPhoneNumber -motherName -motherPhoneNumber -isApproved -isBanned -password -reference -updatedBy -createdAt -updatedAt");
    return { status: true, message: "User retrieved successfully", data: user };
  } catch (error) {
    return { status: false, message: "Error retrieving user", error: error.message };
  }
}


export const GetAllUserForAdminService = async () => {
  try {
    const users = await UserModel.find({});
    const totalUsers = await UserModel.countDocuments({});

    const usersWithRefs = await Promise.all(
      users.map(async (user) => {
        const userData = user.toObject();

        // Check if reference is an ObjectId
        if (userData.reference && userData.reference !== "Self") {
          const referenceUser = await UserModel.findById(
            userData.reference
          ).select(
            "name phone email district upazila role roleSuffix profileImage"
          );

          if (referenceUser) {
            userData.reference = referenceUser;
          }
        } else {
          userData.reference = "Self";
        }

        // Get updatedBy user data if it exists
        if (userData.updatedBy) {
          const updatedByUser = await UserModel.findById(
            userData.updatedBy
          ).select(
            "name phone email district upazila role roleSuffix profileImage"
          );

          if (updatedByUser) {
            userData.updatedBy = updatedByUser;
          }
        }

        return userData;
      })
    );

    return {
      status: true,
      data: {
        users: usersWithRefs,
        totalUsers: totalUsers,
      },
      message: "Users retrieved successfully.",
    };
  } catch (e) {
    return {
      status: false,
      message: "Failed to retrieve users.",
      details: e.message,
    };
  }
};

export const EligibleUserService = async () => {
  try {
    // Find users who are eligible to donate blood
    const eligibleUsers = await UserModel.find(
      {
        eligibility: true,
        isBanned: false,
        isApproved: true,
      },
      {
        nidOrBirthRegistrationImage: 0,
        password: 0,
        reference: 0,
        updatedBy: 0,
        updatedAt: 0,
        createdAt: 0,
      }
    );

    const totalEligibleUsers = await UserModel.countDocuments({
      eligibility: true,
      isBanned: false,
      isApproved: true,
    });

    if (!eligibleUsers || eligibleUsers.length === 0) {
      return { status: false, message: "No eligible users found." };
    }

    return {
      status: true,
      data: {
        users: eligibleUsers,
        totalUsers: totalEligibleUsers,
      },
      message: "Eligible users retrieved successfully.",
    };
  } catch (e) {
    return {
      status: false,
      message: "Failed to retrieve eligible users.",
      details: e.message,
    };
  }
};

export const DeleteUserService = async (req) => {
  try {
    const userId = req.params.userId;

    if (!ObjectId.isValid(userId)) {
      return { status: false, message: "Invalid user ID format." };
    }

    // Get the user to be deleted
    const userToDelete = await UserModel.findById(userId);
    if (!userToDelete) {
      return { status: false, message: "User not found." };
    }

    // Only admin can delete another admin
    if (userToDelete.role === "Admin") {
      const requestingUserId = req.headers.user_id || (req.cookies && req.cookies.user_id);
      const requestingUser = await UserModel.findById(requestingUserId);
      if (!requestingUser || requestingUser.role !== "Admin") {
        return {
          status: false,
          message: "Only admin users can delete admin accounts.",
        };
      }
    }

    // ✅ Delete images if they exist
    const deleteImageIfExists = async (imagePath) => {
      if (imagePath && typeof imagePath === "string" && imagePath.trim() !== "") {
        const fileName = imagePath.split("/").pop();
        if (fileName) {
          const result = await deleteFile(fileName);
          if (!result.status) {
            console.warn("Failed to delete file:", fileName);
          }
        }
      }
    };

    await deleteImageIfExists(userToDelete.profileImage);
    await deleteImageIfExists(userToDelete.nidOrBirthRegistrationImage);

    // ✅ Finally delete user
    const deletedUser = await UserModel.findByIdAndDelete(userId);

    return {
      status: true,
      message: "User deleted successfully.",
      data: deletedUser,
    };
  } catch (e) {
    return {
      status: false,
      message: "Failed to delete user.",
      details: e.message,
    };
  }
};

export const GetUserByBloodGroupService = async (req) => {
  try {
    const bloodGroup = req.params.bloodGroup;

    if (!bloodGroup) {
      return { status: false, message: "Blood group parameter is required." };
    }

    const users = await UserModel.find(
      {
        bloodGroup: bloodGroup,
        isBanned: false,
        isApproved: true,
      },
      {
        nidOrBirthRegistrationImage: 0,
        password: 0,
        reference: 0,
        updatedBy: 0,
        updatedAt: 0,
        createdAt: 0,
      }
    );

    if (!users || users.length === 0) {
      return {
        status: false,
        message: "No users found with the specified blood group.",
      };
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
      details: e.message,
    };
  }
};

export const GetUserByUpazilaService = async (req) => {
  try {
    const upazila = req.params.upazila;

    if (!upazila) {
      return { status: false, message: "Upazila parameter is required." };
    }

    const users = await UserModel.find(
      {
        upazila: upazila,
      },
      {
        nidOrBirthRegistrationImage: 0,
        password: 0,
        reference: 0,
        updatedBy: 0,
        updatedAt: 0,
        createdAt: 0,
      }
    );

    if (!users || users.length === 0) {
      return {
        status: false,
        message: "No users found in the specified upazila.",
      };
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
      details: e.message,
    };
  }
};

export const GetUserByDistrictService = async (req) => {
  try {
    const district = req.params.district;
    

    if (!district) {
      return { status: false, message: "District parameter is required." };
    }

    const users = await UserModel.find(
      {
        district: district,
      },
      {
        nidOrBirthRegistrationImage: 0,
        password: 0,
        reference: 0,
        updatedBy: 0,
        updatedAt: 0,
        createdAt: 0,
      }
    );

    if (!users || users.length === 0) {
      return {
        status: false,
        message: "No users found in the specified district.",
      };
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
      details: e.message,
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
      details: e.message,
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
      details: e.message,
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
      details: e.message,
    };
  }
};

export const GetUserByNameService = async (req) => {
  try {
    const { name } = req.params;

    // Using regex for case-insensitive partial name search
    const users = await UserModel.find(
      {
        name: { $regex: name, $options: "i" },
        eligibility: true,
        isApproved: true,
        isBanned: false,
      },
      {
        nidOrBirthRegistrationImage: 0,
        password: 0,
        reference: 0,
        updatedBy: 0,
        updatedAt: 0,
        createdAt: 0,
      }
    );

    if (!users || users.length === 0) {
      return {
        status: false,
        message: "No users found with the given name.",
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
      details: e.message,
    };
  }
};

export const GetUserByNIDOrBirthRegistrationService = async (req) => {
  try {
    const { nidOrBirthRegistration } = req.params;

    // Find user by email
    const user = await UserModel.findOne(
      {
        identificationNumber: nidOrBirthRegistration,
      },
      {
        nidOrBirthRegistrationImage: 0,
        password: 0,
        reference: 0,
        updatedBy: 0,
        updatedAt: 0,
        createdAt: 0,
      }
    );

    if (!user) {
      return {
        status: false,
        message:
          "No user found with the given NID or birth registration number.",
      };
    }

    return {
      status: true,
      data: user,
      message: "User retrieved successfully.",
    };
  } catch (e) {
    return {
      status: false,
      message: "Failed to retrieve user by NID or birth registration number.",
      details: e.message,
    };
  }
};
