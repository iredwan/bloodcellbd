import DistrictTeam from "../models/DistrictTeamModel.js";
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

// Create DistrictTeam Service
export const CreateDistrictTeamService = async (req) => {
  try {
    const reqBody = req.body;

    // Check if the team already exists for this district
    const existingTeam = await DistrictTeam.findOne({ districtId: reqBody.districtId });
    if (existingTeam) {
      return { status: false, message: "Team already exists for this district" };
    }
    
    // Check if coordinator is already in other team
    const coordinatorInOtherTeam = await DistrictTeam.findOne({
      $or: [
        { districtCoordinatorID: reqBody.districtCoordinatorID },
        { districtSubCoordinatorID: reqBody.districtSubCoordinatorID },
        { districtITMediaCoordinatorID: reqBody.districtITMediaCoordinatorID },
        { districtLogisticsCoordinatorID: reqBody.districtLogisticsCoordinatorID }
      ]
    });
    if (coordinatorInOtherTeam) {
      return { status: false, message: "Coordinator already in other team" };
    }

    // Check if upazila team is already in other team
    if (reqBody.upazilaTeamID && reqBody.upazilaTeamID.length > 0) {
      const upazilaTeamInOtherTeam = await DistrictTeam.findOne({
        upazilaTeamID: { $in: reqBody.upazilaTeamID }
      });
      if (upazilaTeamInOtherTeam) {
        return { status: false, message: "Upazila team already in other district team" };
      }
    }
    
    // Add created by from header or cookie
    const createdBy = req.headers.user_id || req.cookies.user_id;
    if (!createdBy) {
      return { status: false, message: "Unauthorized" };
    }

    reqBody.createdBy = createdBy;
    
    const newDistrictTeam = new DistrictTeam(reqBody);
    await newDistrictTeam.save();
    
    return { status: true, message: "District team created successfully", data: newDistrictTeam };
  } catch (error) {
    return { status: false, message: "Error creating district team", error: error.message };
  }
};

// Get All DistrictTeams Service
export const GetAllDistrictTeamsService = async () => {
  try {
    const districtTeams = await DistrictTeam.find()
      .populate("districtId", "name")
      .populate("districtCoordinatorID", "name isVerified bloodGroup phone profileImage role roleSuffix")
      .populate("districtSubCoordinatorID", "name isVerified bloodGroup phone profileImage role roleSuffix")
      .populate("districtITMediaCoordinatorID", "name isVerified bloodGroup phone profileImage role roleSuffix")
      .populate("districtLogisticsCoordinatorID", "name isVerified bloodGroup phone profileImage role roleSuffix")
      .populate("createdBy", "name email phone profileImage role roleSuffix")
      .populate("updatedBy", "name email phone profileImage role roleSuffix");
    
    if (!districtTeams || districtTeams.length === 0) {
      return { status: false, message: "No district teams found" };
    }

    // Count total upazila teams
    const totalUpazilaTeams = districtTeams.reduce((acc, team) => {
      return acc + (team.upazilaTeamID ? team.upazilaTeamID.length : 0);
    }, 0);
    
    return { 
      status: true, 
      message: "District teams retrieved successfully", 
      data: {
        districtTeams,
        totalUpazilaTeams
      } 
    };
  } catch (error) {
    return { status: false, message: "Error retrieving district teams", error: error.message };
  }
};

// Get DistrictTeam By ID Service
export const GetDistrictTeamByIdService = async (req) => {
  try {
    const teamId = new ObjectId(req.params.id);
    
    const districtTeam = await DistrictTeam.findById(teamId)
      .populate("districtId", "name")
      .populate("districtCoordinatorID", "name email phone profileImage role roleSuffix")
      .populate("districtSubCoordinatorID", "name email phone profileImage role roleSuffix")
      .populate("districtITMediaCoordinatorID", "name email phone profileImage role roleSuffix")
      .populate("districtLogisticsCoordinatorID", "name email phone profileImage role roleSuffix")
      .populate({
        path: "upazilaTeamID",
        populate: [
          {
            path: "upazilaName",
            select: "name"
          },
          {
            path: "upazilaCoordinator",
            select: "name email phone profileImage role roleSuffix"
          },
          {
            path: "upazilaSubCoordinator",
            select: "name email phone profileImage role roleSuffix"
          },
          {
            path: "upazilaITMediaCoordinator",
            select: "name email phone profileImage role roleSuffix"
          },
          {
            path: "upazilaLogisticsCoordinator",
            select: "name email phone profileImage role roleSuffix"
          },
          {
            path: "monitorTeams",
            select: "teamMonitor teamName",
            populate: {
              path: "teamMonitor",
              select: "name profileImage"
            }
          },

        ]
      })
      .populate("createdBy", "name email phone profileImage role roleSuffix")
      .populate("updatedBy", "name email phone profileImage role roleSuffix");
    
    if (!districtTeam) {
      return { status: false, message: "District team not found" };
    }
    
    return { status: true, message: "District team retrieved successfully", data: districtTeam };
  } catch (error) {
    return { status: false, message: "Error retrieving district team", error: error.message };
  }
};

// Get DistrictTeam By District Coordinators User ID Service
export const GetDistrictTeamByDistrictCoordinatorsUserIdService = async (req, res) => {
  try {
    const userId = req.headers.user_id || req.cookies.user_id;
    const districtTeam = await DistrictTeam.find({
      $or: [
        { districtCoordinatorID: userId },
        { districtSubCoordinatorID: userId },
        { districtITMediaCoordinatorID: userId },
        { districtLogisticsCoordinatorID: userId }
      ] 
    }).populate("districtId", "name")
    .populate("districtCoordinatorID", "name email phone profileImage role roleSuffix")
    .populate("districtSubCoordinatorID", "name email phone profileImage role roleSuffix")
    .populate("districtITMediaCoordinatorID", "name email phone profileImage role roleSuffix")
    .populate("districtLogisticsCoordinatorID", "name email phone profileImage role roleSuffix");
    return { status: true, message: "District team retrieved successfully", data: districtTeam };
  } catch (error) {
    return { status: false, message: "Error retrieving district team", error: error.message };
  }
};

// Update DistrictTeam Service
export const UpdateDistrictTeamService = async (req) => {
  try {
    const teamId = new ObjectId(req.params.id);
    const reqBody = req.body;
    
    // Add updated by from header or cookie
    const updatedBy = req.headers.user_id || req.cookies.user_id;
    if (!updatedBy) {
      return { status: false, message: "Unauthorized" };
    }
    reqBody.updatedBy = updatedBy;

    // Check if coordinator is already in other team
    if (reqBody.districtCoordinatorID || reqBody.districtSubCoordinatorID || 
        reqBody.districtITMediaCoordinatorID || reqBody.districtLogisticsCoordinatorID) {
      const coordinatorInOtherTeam = await DistrictTeam.findOne({
        _id: { $ne: teamId },
        $or: [
          { districtCoordinatorID: reqBody.districtCoordinatorID },
          { districtSubCoordinatorID: reqBody.districtSubCoordinatorID },
          { districtITMediaCoordinatorID: reqBody.districtITMediaCoordinatorID },
          { districtLogisticsCoordinatorID: reqBody.districtLogisticsCoordinatorID }
        ]
      });
      if (coordinatorInOtherTeam) {
        return { status: false, message: "Coordinator already in other team" };
      }
    }

    // Check if upazila team is already in other team
    if (reqBody.upazilaTeamID && reqBody.upazilaTeamID.length > 0) {
      const upazilaTeamInOtherTeam = await DistrictTeam.findOne({
        _id: { $ne: teamId },
        upazilaTeamID: { $in: reqBody.upazilaTeamID }
      });
      if (upazilaTeamInOtherTeam) {
        return { status: false, message: "Upazila team already in other district team" };
      }
    }
    
    const updatedDistrictTeam = await DistrictTeam.findByIdAndUpdate(
      teamId,
      { $set: reqBody },
      { new: true }
    );
    
    if (!updatedDistrictTeam) {
      return { status: false, message: "District team not found" };
    }
    
    return { status: true, message: "District team updated successfully", data: updatedDistrictTeam };
  } catch (error) {
    return { status: false, message: "Error updating district team", error: error.message };
  }
};

// Delete DistrictTeam Service
export const DeleteDistrictTeamService = async (req) => {
  try {
    const teamId = new ObjectId(req.params.id);
    
    const deletedDistrictTeam = await DistrictTeam.findByIdAndDelete(teamId);
    
    if (!deletedDistrictTeam) {
      return { status: false, message: "District team not found" };
    }
    
    return { status: true, message: "District team deleted successfully" };
  } catch (error) {
    return { status: false, message: "Error deleting district team", error: error.message };
  }
};
