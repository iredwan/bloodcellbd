import UpazilaTeam from "../models/UpazilaTeamModel.js";
import mongoose from "mongoose";
import userModel from './../models/UserModel.js';
const ObjectId = mongoose.Types.ObjectId;

// Create UpazilaTeam Service
export const CreateUpazilaTeamService = async (req) => {
  try {
    const reqBody = req.body;
    
    const upazilaCoordinator = await userModel.findById(reqBody.upazilaCoordinator);
    if (reqBody.upazilaCoordinator) {
      if (upazilaCoordinator.role !== "Upazila Coordinator") {
        return { status: false, message: "You have to set user role as Upazila Coordinator" };
      }
    }

    const upazilaCoCoordinator = await userModel.findById(reqBody.upazilaCoCoordinator);
    if (reqBody.upazilaCoCoordinator) {
      if (upazilaCoCoordinator.role !== "Upazila Co-coordinator") {
        return { status: false, message: "You have to set user role as Upazila Co-coordinator" };
      }
    }

    const upazilaITMediaCoordinator = await userModel.findById(reqBody.upazilaITMediaCoordinator);
    if (reqBody.upazilaITMediaCoordinator) {
      if (upazilaITMediaCoordinator.role !== "Upazila IT & Media Coordinator") {
        return { status: false, message: "You have to set user role as Upazila IT & Media Coordinator" };
      }
    }

    const upazilaLogisticsCoordinator = await userModel.findById(reqBody.upazilaLogisticsCoordinator);
    if (reqBody.upazilaLogisticsCoordinator) {
      if (upazilaLogisticsCoordinator.role !== "Upazila Logistics Coordinator") {
        return { status: false, message: "You have to set user role as Upazila Logistics Coordinator" };
      }
    }

    // Check if the team already exists for this upazila
    const existingTeam = await UpazilaTeam.findOne({ upazilaName: reqBody.upazilaName });
    if (existingTeam) {
      return { status: false, message: "Team already exists for this upazila" };
    }
    
    //check if coordinator is already in other team
    const coordinatorInOtherTeam = await UpazilaTeam.findOne({
         $or: [
        { upazilaCoordinator: reqBody.upazilaCoordinator },
        { upazilaCoCoordinator: reqBody.upazilaCoCoordinator },
        { upazilaITMediaCoordinator: reqBody.upazilaITMediaCoordinator },
        { upazilaLogisticsCoordinator: reqBody.upazilaLogisticsCoordinator }
      ]
    });
    if (coordinatorInOtherTeam) {
      return { status: false, message: "Coordinator already in other team" };
    }

    //check if monitor team is already in other team
    const monitorTeamInOtherTeam = await UpazilaTeam.findOne({
      monitorTeams: { $in: [reqBody.monitorTeamId] }
    });
    if (monitorTeamInOtherTeam) {
      return { status: false, message: "Monitor team already in other team" };
    }
    
    // Add created by from header or cookie
    const createdBy = req.headers.user_id || req.cookies.user_id;
    if (!createdBy) {
      return { status: false, message: "Unauthorized" };
    }

    reqBody.createdBy = createdBy;
    
    const newUpazilaTeam = new UpazilaTeam(reqBody);
    await newUpazilaTeam.save();
    
    return { status: true, message: "Upazila team created successfully", data: newUpazilaTeam };
  } catch (error) {
    return { status: false, message: "Error creating upazila team", error: error.message };
  }
};

// Get All UpazilaTeams Service
export const GetAllUpazilaTeamsService = async (req) => {
  try {
    const districtName = req.query.districtName;
    const upazilaName = req.query.upazilaName;

    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    let query = {};
    if (upazilaName) {
      query.upazilaName = { $regex: upazilaName, $options: "i" };
    }
    if (districtName) {
      query.districtName = { $regex: districtName, $options: "i" };
    }

    const total = await UpazilaTeam.countDocuments(query); // ✅ Total count

    const upazilaTeams = await UpazilaTeam.find(query)
      .skip(skip)       // ✅ Pagination skip
      .limit(limit)     // ✅ Pagination limit
      .populate("upazilaCoordinator", "name bloodGroup isVerified phone profileImage role roleSuffix")
      .populate("upazilaCoCoordinator", "name bloodGroup isVerified phone profileImage role roleSuffix")
      .populate("upazilaITMediaCoordinator", "name bloodGroup isVerified phone profileImage role roleSuffix")
      .populate("upazilaLogisticsCoordinator", "name bloodGroup isVerified phone profileImage role roleSuffix")
      .populate("monitorTeams", "teamName")
      .populate({
        path: "createdBy",
        select: "name bloodGroup isVerified phone profileImage role roleSuffix"
      })
      .populate({
        path: "updatedBy",
        select: "name bloodGroup isVerified phone profileImage role roleSuffix"
      });

    if (!upazilaTeams || upazilaTeams.length === 0) {
      return { status: false, message: "No upazila teams found" };
    }

    // Count total monitor teams from result
    const totalMonitorTeams = upazilaTeams.reduce((acc, team) => {
      return acc + (team.monitorTeams ? team.monitorTeams.length : 0);
    }, 0);

    return {
      status: true,
      message: "Upazila teams retrieved successfully",
      data: {
        upazilaTeams,
        totalMonitorTeams,
        pagination: {
          totalItems: total,
          currentPage: page,
          itemsPerPage: limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  } catch (error) {
    return {
      status: false,
      message: "Error retrieving upazila team",
      error: error.message,
    };
  }
};


// Get UpazilaTeam By ID Service
export const GetUpazilaTeamByIdService = async (req) => {
  try {
    const teamId = new ObjectId(req.params.id);
    
    const upazilaTeam = await UpazilaTeam.findById(teamId)
      .populate("upazilaCoordinator", "name bloodGroup isVerified phone profileImage role roleSuffix")
      .populate("upazilaCoCoordinator", "name bloodGroup isVerified phone profileImage role roleSuffix")
      .populate("upazilaITMediaCoordinator", "name bloodGroup isVerified phone profileImage role roleSuffix")
      .populate("upazilaLogisticsCoordinator", "name bloodGroup isVerified phone profileImage role roleSuffix")
      .populate({
        path: "monitorTeams",
        populate: [{
          path: "teamMonitor",
          select: "name bloodGroup isVerified phone profileImage role roleSuffix"
        },
        {
          path: "moderatorTeamID",
          populate: [{
            path: "moderatorName", 
            select: "name bloodGroup isVerified phone profileImage role roleSuffix"
          }]
        }]
      })
      .populate("createdBy", "name bloodGroup isVerified phone profileImage role roleSuffix")
      .populate("updatedBy", "name bloodGroup isVerified phone profileImage role roleSuffix");
    
    if (!upazilaTeam) {
      return { status: false, message: "Upazila team not found" };
    }

    // Count total moderator teams
    const totalModeratorTeams = upazilaTeam.monitorTeams.reduce((acc, team) => {
      return acc + (team.moderatorTeamID ? 1 : 0);
    }, 0);
    
    return { 
      status: true, 
      message: "Upazila team retrieved successfully", 
      data: {
        upazilaTeam,
        totalModeratorTeams
      }
    };
  } catch (error) {
    return { status: false, message: "Error retrieving upazila team", error: error.message };
  }
};

// Get UpazilaTeam By Upazila Coordinators User ID
export const GetUpazilaTeamByUpazilaCoordinatorsUserIdService = async (req) => {
  try {
    const userId = req.headers.user_id || req.cookies.user_id;

    const upazilaTeam = await UpazilaTeam.find({
      $or: [
        { upazilaCoordinator: userId },
        { upazilaCoCoordinator: userId },
        { upazilaITMediaCoordinator: userId },
        { upazilaLogisticsCoordinator: userId }
      ]
    })
    .populate("upazilaCoordinator", "name bloodGroup isVerified phone profileImage role roleSuffix")
    .populate("upazilaCoCoordinator", "name bloodGroup isVerified phone profileImage role roleSuffix")
    .populate("upazilaITMediaCoordinator", "name bloodGroup isVerified phone profileImage role roleSuffix")
    .populate("upazilaLogisticsCoordinator", "name bloodGroup isVerified phone profileImage role roleSuffix");
      return { status: true, message: "Upazila team retrieved successfully", data: upazilaTeam };
  } catch (error) {
    return { status: false, message: "Error retrieving upazila team", error: error.message };
  }
};

// Update UpazilaTeam Service
export const UpdateUpazilaTeamService = async (req) => {
  try {
    const teamId = new ObjectId(req.params.id);
    const reqBody = req.body;

    const upazilaCoordinator = reqBody.upazilaCoordinator
      ? new ObjectId(reqBody.upazilaCoordinator)
      : null;
    const upazilaCoCoordinator = reqBody.upazilaCoCoordinator
      ? new ObjectId(reqBody.upazilaCoCoordinator)
      : null;
    const upazilaITMediaCoordinator = reqBody.upazilaITMediaCoordinator
      ? new ObjectId(reqBody.upazilaITMediaCoordinator)
      : null;
    const upazilaLogisticsCoordinator = reqBody.upazilaLogisticsCoordinator
      ? new ObjectId(reqBody.upazilaLogisticsCoordinator)
      : null;

    const updatedBy = req.headers.user_id || req.cookies.user_id;
    if (!updatedBy) {
      return { status: false, message: "Unauthorized" };
    }
    reqBody.updatedBy = updatedBy;

    // ✅ Dynamic role validation (if role object sent)
    const allowedRoles = [
      "Upazila Coordinator",
      "Upazila CoCoordinator",
      "Upazila IT & Media Coordinator",
      "Upazila Logistics Coordinator",
    ];

    if (
      reqBody?.upazilaCoordinatorDetails &&
      !allowedRoles.includes(reqBody.upazilaCoordinatorDetails?.role)
    ) {
      return {
        status: false,
        message:
          "You must assign a valid role: Upazila Coordinator, CoCoordinator, IT & Media Coordinator or Logistics Coordinator.",
      };
    }

    // ✅ Check if coordinator is already in other team
    const orConditions = [];

    if (upazilaCoordinator) {
      orConditions.push({ upazilaCoordinator });
    }
    if (upazilaCoCoordinator) {
      orConditions.push({ upazilaCoCoordinator });
    }
    if (upazilaITMediaCoordinator) {
      orConditions.push({ upazilaITMediaCoordinator });
    }
    if (upazilaLogisticsCoordinator) {
      orConditions.push({ upazilaLogisticsCoordinator });
    }

    let coordinatorInOtherTeam = [];

    if (orConditions.length > 0) {
      coordinatorInOtherTeam = await UpazilaTeam.find({
        _id: { $ne: teamId },
        $or: orConditions,
      });

      if (coordinatorInOtherTeam.length > 0) {
        return {
          status: false,
          message: "Coordinator already exists in another Upazila team.",
          data: coordinatorInOtherTeam,
        };
      }
    }

    // ✅ Check monitor team conflict
    if (reqBody.monitorTeamId) {
      const monitorTeamInOtherTeam = await UpazilaTeam.findOne({
        _id: { $ne: teamId },
        monitorTeams: { $in: [reqBody.monitorTeamId] },
      });

      if (monitorTeamInOtherTeam) {
        return {
          status: false,
          message: "Monitor team already assigned to another Upazila team.",
        };
      }
    }

    // ✅ Final update
    const updatedUpazilaTeam = await UpazilaTeam.findByIdAndUpdate(
      teamId,
      { $set: reqBody },
      { new: true }
    );

    if (!updatedUpazilaTeam) {
      return { status: false, message: "Upazila team not found" };
    }

    return {
      status: true,
      message: "Upazila team updated successfully",
      data: updatedUpazilaTeam,
    };
  } catch (error) {
    return {
      status: false,
      message: "Error updating Upazila team",
      error: error.message,
    };
  }
};

// Delete UpazilaTeam Service
export const DeleteUpazilaTeamService = async (req) => {
  try {
    const teamId = new ObjectId(req.params.id);
    
    const deletedUpazilaTeam = await UpazilaTeam.findByIdAndDelete(teamId);
    
    if (!deletedUpazilaTeam) {
      return { status: false, message: "Upazila team not found" };
    }
    
    return { status: true, message: "Upazila team deleted successfully" };
  } catch (error) {
    return { status: false, message: "Error deleting upazila team", error: error.message };
  }
};
