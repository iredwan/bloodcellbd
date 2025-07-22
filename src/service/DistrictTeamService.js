import DistrictTeam from "../models/DistrictTeamModel.js";
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

// Create DistrictTeam Service
export const CreateDistrictTeamService = async (req) => {
  try {
    const reqBody = req.body;

    // Check if the team already exists for this district
    const existingTeam = await DistrictTeam.findOne({ districtName: reqBody.districtName });
    if (existingTeam) {
      return { status: false, message: "Team already exists for this district" };
    }
    
    // Check if coordinator is already in other team
    const coordinatorInOtherTeam = await DistrictTeam.findOne({
      $or: [
        { districtCoordinatorID: reqBody.districtCoordinatorID },
        { districtCoCoordinatorID: reqBody.districtCoCoordinatorID },
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
export const GetAllDistrictTeamsService = async (req) => {
  const districtName = req?.query?.districtName;
  const limit = parseInt(req?.query?.limit) || 10;
  const page = parseInt(req?.query?.page) || 1;

  let query = {};
  if (districtName) {
    query.districtName = { $regex: districtName, $options: "i" };
  }

  try {
    const total = await DistrictTeam.countDocuments(query); // ✅ Total count for pagination

    const districtTeams = await DistrictTeam.find(query)
      .skip((page - 1) * limit) // ✅ Skip for pagination
      .limit(limit)             // ✅ Limit for pagination
      .populate("districtCoordinatorID", "name isVerified bloodGroup phone profileImage role roleSuffix")
      .populate("districtCoCoordinatorID", "name isVerified bloodGroup phone profileImage role roleSuffix")
      .populate("districtITMediaCoordinatorID", "name isVerified bloodGroup phone profileImage role roleSuffix")
      .populate("districtLogisticsCoordinatorID", "name isVerified bloodGroup phone profileImage role roleSuffix")
      .populate("upazilaTeamID", "upazilaName")
      .populate("createdBy", "name email phone profileImage role roleSuffix")
      .populate("updatedBy", "name email phone profileImage role roleSuffix");

    if (!districtTeams || districtTeams.length === 0) {
      return { status: false, message: "No district teams found" };
    }

    // Count total upazila teams inside returned items
    const totalUpazilaTeams = districtTeams.reduce((acc, team) => {
      return acc + (team.upazilaTeamID ? team.upazilaTeamID.length : 0);
    }, 0);

    return {
      status: true,
      message: "District teams retrieved successfully",
      data: {
        districtTeams,
        pagination: {
          totalItems: total,
          currentPage: page,
          itemsPerPage: limit,
          totalPages: Math.ceil(total / limit),
        },
        totalUpazilaTeams,
      },
    };
  } catch (error) {
    return {
      status: false,
      message: "Error retrieving district teams",
      error: error.message,
    };
  }
};

// Get DistrictTeam By ID Service
export const GetDistrictTeamByIdService = async (req) => {
  try {
    const teamId = new ObjectId(req.params.id);
    
    const districtTeam = await DistrictTeam.findById(teamId)
      .populate("districtCoordinatorID", "name isVerified bloodGroup phone profileImage role roleSuffix")
      .populate("districtCoCoordinatorID", "name isVerified bloodGroup phone profileImage role roleSuffix")
      .populate("districtITMediaCoordinatorID", "name isVerified bloodGroup phone profileImage role roleSuffix")
      .populate("districtLogisticsCoordinatorID", "name isVerified bloodGroup phone profileImage role roleSuffix")
      .populate({
        path: "upazilaTeamID",
        populate: [
          {
            path: "upazilaName",
            select: "name"
          },
          {
            path: "upazilaCoordinator",
            select: "name isVerified bloodGroup phone profileImage role roleSuffix"
          },
          {
            path: "upazilaCoCoordinator",
            select: "name isVerified bloodGroup phone profileImage role roleSuffix"
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
    const userId = new ObjectId(req.headers.user_id || req.cookies.user_id);
    const districtTeam = await DistrictTeam.find({
      $or: [
        { districtCoordinatorID: userId },
        { districtCoCoordinatorID: userId },
        { districtITMediaCoordinatorID: userId },
        { districtLogisticsCoordinatorID: userId }
      ]
    })
    .populate("districtCoordinatorID", "name phone profileImage role bloodGroup roleSuffix")
    .populate("districtCoCoordinatorID", "name phone profileImage role bloodGroup roleSuffix")
    .populate("districtITMediaCoordinatorID", "name phone profileImage role bloodGroup roleSuffix")
    .populate("districtLogisticsCoordinatorID", "name phone profileImage role bloodGroup roleSuffix");
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
    const districtCoordinatorID = reqBody.districtCoordinatorID ? new ObjectId(reqBody.districtCoordinatorID) : null;
    const districtCoCoordinatorID = reqBody.districtCoCoordinatorID ? new ObjectId(reqBody.districtCoCoordinatorID) : null;
    const districtITMediaCoordinatorID = reqBody.districtITMediaCoordinatorID ? new ObjectId(reqBody.districtITMediaCoordinatorID) : null;
    const districtLogisticsCoordinatorID = reqBody.districtLogisticsCoordinatorID ? new ObjectId(reqBody.districtLogisticsCoordinatorID) : null;
    
    // Add updated by from header or cookie
    const updatedBy = req.headers.user_id || req.cookies.user_id;
    if (!updatedBy) {
      return { status: false, message: "Unauthorized" };
    }
    reqBody.updatedBy = updatedBy;

    // Check if coordinator is already in other team
    const orConditions = [];

        if (districtCoordinatorID) {
          orConditions.push({ districtCoordinatorID });
        }
        if (districtCoCoordinatorID) {
          orConditions.push({ districtCoCoordinatorID });
        }
        if (districtITMediaCoordinatorID) {
          orConditions.push({ districtITMediaCoordinatorID });
        }
        if (districtLogisticsCoordinatorID) {
          orConditions.push({ districtLogisticsCoordinatorID });
        }

        let coordinatorInOtherTeam = [];

        if (orConditions.length > 0) {
          coordinatorInOtherTeam = await DistrictTeam.find({
            _id: { $ne: teamId },
            $or: orConditions,
          });
      if (coordinatorInOtherTeam) {
        return { status: false, message: "Coordinator already in other team", data: coordinatorInOtherTeam };
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
