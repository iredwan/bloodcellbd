import DivisionalTeam from "../models/DivisionalTeamModel.js";
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

// Create DivisionalTeam Service
export const CreateDivisionalTeamService = async (req) => {
  try {
    const reqBody = req.body;

    // Check if coordinator is already in other team
    const coordinatorInOtherTeam = await DivisionalTeam.findOne({
      $or: [
        { divisionalCoordinatorID: reqBody.divisionalCoordinatorID },
        { divisionalSubCoordinatorID: reqBody.divisionalSubCoordinatorID }
      ]
    });
    if (coordinatorInOtherTeam) {
      return { status: false, message: "Coordinator already in other team" };
    }

    // Check if district team is already in other divisional team
    if (reqBody.districtTeamID && reqBody.districtTeamID.length > 0) {
      const districtTeamInOtherTeam = await DivisionalTeam.findOne({
        districtTeamID: { $in: reqBody.districtTeamID }
      });
      if (districtTeamInOtherTeam) {
        return { status: false, message: "District team already in other divisional team" };
      }
    }
    
    // Add created by from header or cookie
    const createdBy = req.headers.user_id || req.cookies.user_id;
    if (!createdBy) {
      return { status: false, message: "Unauthorized" };
    }

    reqBody.createdBy = createdBy;
    
    const newDivisionalTeam = new DivisionalTeam(reqBody);
    await newDivisionalTeam.save();
    
    return { status: true, message: "Divisional team created successfully", data: newDivisionalTeam };
  } catch (error) {
    return { status: false, message: "Error creating divisional team", error: error.message };
  }
};

// Get All DivisionalTeams Service
export const GetAllDivisionalTeamsService = async () => {
  try {
    const divisionalTeams = await DivisionalTeam.find()
      .populate("divisionID", "name")
      .populate("divisionalCoordinatorID", "name email phone profileImage role roleSuffix")
      .populate("divisionalSubCoordinatorID", "name email phone profileImage role roleSuffix")
      .populate({
        path: "districtTeamID",
        populate: [
          {
            path: "districtId",
            select: "name"
          },
          {
            path: "districtCoordinatorID",
            select: "name email phone profileImage role roleSuffix"
          },
          {
            path: "districtSubCoordinatorID",
            select: "name email phone profileImage role roleSuffix"
          },
          {
            path: "districtITMediaCoordinatorID",
            select: "name email phone profileImage role roleSuffix"
          },
          {
            path: "districtLogisticsCoordinatorID",
            select: "name email phone profileImage role roleSuffix"
          }
        ]
      })
      .populate("createdBy", "name email phone profileImage role roleSuffix")
      .populate("updatedBy", "name email phone profileImage role roleSuffix");
    
    if (!divisionalTeams || divisionalTeams.length === 0) {
      return { status: false, message: "No divisional teams found" };
    }

    // Count total district teams
    const totalDistrictTeams = divisionalTeams.reduce((acc, team) => {
      return acc + (team.districtTeamID ? team.districtTeamID.length : 0);
    }, 0);
    
    return { 
      status: true, 
      message: "Divisional teams retrieved successfully", 
      data: {
        divisionalTeams,
        totalDistrictTeams
      } 
    };
  } catch (error) {
    return { status: false, message: "Error retrieving divisional teams", error: error.message };
  }
};

// Get DivisionalTeam By ID Service
export const GetDivisionalTeamByIdService = async (req) => {
  try {
    const teamId = new ObjectId(req.params.id);
    
    const divisionalTeam = await DivisionalTeam.findById(teamId)
      .populate("divisionID", "name")
      .populate("divisionalCoordinatorID", "name email phone profileImage role roleSuffix")
      .populate("divisionalSubCoordinatorID", "name email phone profileImage role roleSuffix")
      .populate({
        path: "districtTeamID",
        populate: [
          {
            path: "districtId",
            select: "name"
          },
          {
            path: "districtCoordinatorID",
            select: "name email phone profileImage role roleSuffix"
          },
          {
            path: "districtSubCoordinatorID",
            select: "name email phone profileImage role roleSuffix"
          },
          {
            path: "districtITMediaCoordinatorID",
            select: "name email phone profileImage role roleSuffix"
          },
          {
            path: "districtLogisticsCoordinatorID",
            select: "name email phone profileImage role roleSuffix"
          },
          {
            path: "upazilaTeamID",
            select: "upazilaName",
            populate: {
              path: "upazilaName",
              select: "name"
            }
          }
        ]
      })
      .populate("createdBy", "name email phone profileImage role roleSuffix")
      .populate("updatedBy", "name email phone profileImage role roleSuffix");
    
    if (!divisionalTeam) {
      return { status: false, message: "Divisional team not found" };
    }
    
    return { status: true, message: "Divisional team retrieved successfully", data: divisionalTeam };
  } catch (error) {
    return { status: false, message: "Error retrieving divisional team", error: error.message };
  }
};

// Get DivisionalTeam By Divisional Coordinators User ID Service
export const GetDivisionalTeamByDivisionalCoordinatorsUserIdService = async (req, res) => {
  try {
    const userId = req.headers.user_id || req.cookies.user_id;
    const divisionalTeam = await DivisionalTeam.find({
      $or: [
        { divisionalCoordinatorID: userId },
        { divisionalSubCoordinatorID: userId }
      ]
    });
    return { status: true, message: "Divisional team retrieved successfully", data: divisionalTeam };
  } catch (error) {
    return { status: false, message: "Error retrieving divisional team", error: error.message };
  }
};


// Update DivisionalTeam Service
export const UpdateDivisionalTeamService = async (req) => {
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
    if (reqBody.divisionalCoordinatorID || reqBody.divisionalSubCoordinatorID) {
      const coordinatorInOtherTeam = await DivisionalTeam.findOne({
        _id: { $ne: teamId },
        $or: [
          { divisionalCoordinatorID: reqBody.divisionalCoordinatorID },
          { divisionalSubCoordinatorID: reqBody.divisionalSubCoordinatorID }
        ]
      });
      if (coordinatorInOtherTeam) {
        return { status: false, message: "Coordinator already in other team" };
      }
    }

    // Check if district team is already in other divisional team
    if (reqBody.districtTeamID && reqBody.districtTeamID.length > 0) {
      const districtTeamInOtherTeam = await DivisionalTeam.findOne({
        _id: { $ne: teamId },
        districtTeamID: { $in: reqBody.districtTeamID }
      });
      if (districtTeamInOtherTeam) {
        return { status: false, message: "District team already in other divisional team" };
      }
    }
    
    const updatedDivisionalTeam = await DivisionalTeam.findByIdAndUpdate(
      teamId,
      { $set: reqBody },
      { new: true }
    );
    
    if (!updatedDivisionalTeam) {
      return { status: false, message: "Divisional team not found" };
    }
    
    return { status: true, message: "Divisional team updated successfully", data: updatedDivisionalTeam };
  } catch (error) {
    return { status: false, message: "Error updating divisional team", error: error.message };
  }
};

// Delete DivisionalTeam Service
export const DeleteDivisionalTeamService = async (req) => {
  try {
    const teamId = new ObjectId(req.params.id);
    
    const deletedDivisionalTeam = await DivisionalTeam.findByIdAndDelete(teamId);
    
    if (!deletedDivisionalTeam) {
      return { status: false, message: "Divisional team not found" };
    }
    
    return { status: true, message: "Divisional team deleted successfully" };
  } catch (error) {
    return { status: false, message: "Error deleting divisional team", error: error.message };
  }
};
