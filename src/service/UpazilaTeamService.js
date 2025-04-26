import UpazilaTeam from "../models/UpazilaTeamModel.js";
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

// Create UpazilaTeam Service
export const CreateUpazilaTeamService = async (req) => {
  try {
    const reqBody = req.body;

    //check if user role is not set upazila coordinator, sub-coordinator, it-media coordinator, logistics coordinator
    if (req.user.role !== "Upazila Coordinator" && req.user.role !== "Upazila Sub-Coordinator" && req.user.role !== "Upazila IT & Media Coordinator" && req.user.role !== "Upazila Logistics Coordinator") {
      return { status: false, message: "You have to set user role as Upazila Coordinator, Upazila Sub-Coordinator, Upazila IT & Media Coordinator, Upazila Logistics Coordinator" };
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
        { upazilaSubCoordinator: reqBody.upazilaSubCoordinator },
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
export const GetAllUpazilaTeamsService = async () => {
  try {
    const upazilaTeams = await UpazilaTeam.find()
      .populate("upazilaName", "name")
      .populate("upazilaCoordinator", "name email phone profileImage role roleSuffix")
      .populate("upazilaSubCoordinator", "name email phone profileImage role roleSuffix")
      .populate("upazilaITMediaCoordinator", "name email phone profileImage role roleSuffix")
      .populate("upazilaLogisticsCoordinator", "name email phone profileImage role roleSuffix")
      .populate({
        path: "monitorTeams",
        populate: [{
          path: "teamMonitor",
          select: "name email phone profileImage"
        },
        {
          path: "moderatorTeamID",
          populate: [{
            path: "moderatorName",
            select: "name email phone profileImage role roleSuffix"
          },
          {
            path: "moderatorTeamMembers",
            select: "name email phone profileImage role roleSuffix"
          }]
        }]
      })
      .populate({
        path: "createdBy",
        select: "name email phone profileImage role roleSuffix"
      })
      .populate({
        path: "updatedBy", 
        select: "name email phone profileImage role roleSuffix"
      });
    
    if (!upazilaTeams || upazilaTeams.length === 0) {
      return { status: false, message: "No upazila teams found" };
    }

    // // Count total monitor teams
    const totalMonitorTeams = upazilaTeams.reduce((acc, team) => {
      return acc + (team.monitorTeams ? team.monitorTeams.length : 0);
    }, 0);
    
    return { status: true, message: "Upazila teams retrieved successfully", data: {
      upazilaTeams,
      totalMonitorTeams
    } };
  } catch (error) {
    return { status: false, message: "Error retrieving upazila team", error: error.message };
  }
};

// Get UpazilaTeam By ID Service
export const GetUpazilaTeamByIdService = async (req) => {
  try {
    const teamId = new ObjectId(req.params.id);
    
    const upazilaTeam = await UpazilaTeam.findById(teamId)
      .populate("upazilaName", "name")
      .populate("upazilaCoordinator", "name phone profileImage role roleSuffix")
      .populate("upazilaSubCoordinator", "name phone profileImage role roleSuffix")
      .populate("upazilaITMediaCoordinator", "name phone profileImage role roleSuffix")
      .populate("upazilaLogisticsCoordinator", "name phone profileImage role roleSuffix")
      .populate({
        path: "monitorTeams",
        populate: [{
          path: "teamMonitor",
          select: "name email phone profileImage role roleSuffix"
        },
        {
          path: "moderatorTeamID",
          populate: [{
            path: "moderatorName", 
            select: "name email phone profileImage role roleSuffix"
          },
          {
            path: "moderatorTeamMembers",
            select: "name email phone profileImage role roleSuffix"
          }]
        }]
      })
      .populate("createdBy", "name phone profileImage role roleSuffix")
      .populate("updatedBy", "name phone profileImage role roleSuffix");
    
    if (!upazilaTeam) {
      return { status: false, message: "Upazila team not found" };
    }
    
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
    
    // Add updated by from header or cookie
    const updatedBy = req.headers.user_id || req.cookies.user_id;
    if (!updatedBy) {
      return { status: false, message: "Unauthorized" };
    }
    reqBody.updatedBy = updatedBy;

    //check if new user role is not set upazila coordinator, sub-coordinator, it-media coordinator, logistics coordinator
    if (reqBody.upazilaCoordinator && reqBody.upazilaCoordinator.role !== "Upazila Coordinator" && reqBody.upazilaCoordinator.role !== "Upazila Sub-Coordinator" && reqBody.upazilaCoordinator.role !== "Upazila IT & Media Coordinator" && reqBody.upazilaCoordinator.role !== "Upazila Logistics Coordinator") {
      return { status: false, message: "You have to set user role as Upazila Coordinator, Upazila Sub-Coordinator, Upazila IT & Media Coordinator, Upazila Logistics Coordinator" };
    }

    //check if coordinator is already in other team
    const coordinatorInOtherTeam = await UpazilaTeam.findOne({
      _id: { $ne: teamId },
      $or: [
        { upazilaCoordinator: reqBody.upazilaCoordinator },
        { upazilaSubCoordinator: reqBody.upazilaSubCoordinator },
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
    
    
    const updatedUpazilaTeam = await UpazilaTeam.findByIdAndUpdate(
      teamId,
      { $set: reqBody },
      { new: true }
    )
    
    if (!updatedUpazilaTeam) {
      return { status: false, message: "Upazila team not found" };
    }
    
    return { status: true, message: "Upazila team updated successfully" };
  } catch (error) {
    return { status: false, message: "Error updating upazila team", error: error.message };
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
