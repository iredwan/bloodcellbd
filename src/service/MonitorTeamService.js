import MonitorTeamModel from "../models/MonitorTeamModel.js";
import mongoose from "mongoose";
import UserModel from "../models/UserModel.js";
import ModeratorTeamModel from "../models/ModeratorTeamModel.js";

const ObjectId = mongoose.Types.ObjectId;

// Create Monitor Team
export const CreateMonitorTeamService = async (req) => {
  try {
    // Get user ID from headers or cookies for createdBy field
    const createdById = req.headers.user_id || (req.cookies && req.cookies.user_id);
    
    if (!createdById || !ObjectId.isValid(createdById)) {
      return {
        status: false,
        message: "Valid user ID is required in headers or cookies."
      };
    }

    const reqBody = req.body;     
    const teamMonitor = reqBody.teamMonitor;
    const { moderatorTeamID } = reqBody;

    // Generate team name with index from database
    const teamCount = await MonitorTeamModel.countDocuments();
    const teamName = `Monitor Team ${teamCount + 1}`;
    
    const user = await UserModel.findById(teamMonitor);
    
    // Check if monitor is found
    if (!user) {
      return {
        status: false,
        message: "Monitor not found with this ID."
      };
    }

    // Check if added monitor role is not monitor
    if (user.role !== "Monitor") {
      return {
        status: false,
        message: "You have to set this user as a monitor first."
      };
    }

    // Check if monitor is already in a team
    const existingMonitor = await MonitorTeamModel.findOne({ teamMonitor });
    if (existingMonitor) {
      return {
        status: false,
        message: "Monitor is already in a team."
      }
    };


    // Validate moderator teams if provided
    if (moderatorTeamID && moderatorTeamID.length > 0) {
      // Check if moderator teams exist
      const teamsCount = await ModeratorTeamModel.countDocuments({
        _id: { $in: moderatorTeamID }
      });
      
      if (teamsCount !== moderatorTeamID.length) {
        return {
          status: false,
          message: "One or more moderator teams not found."
        };
      }
      
      // Check if moderator teams are already assigned to another monitor team
      const assignedTeams = await MonitorTeamModel.find({
        moderatorTeamID: { $in: moderatorTeamID }
      });
      
      if (assignedTeams.length > 0) {
        return {
          status: false,
          message: "One or more moderator teams are already assigned to another monitor team."
        };
      }
    }

    // Create new monitor team
    const newMonitorTeam = await MonitorTeamModel.create({
      teamName,
      teamMonitor,
      moderatorTeamID: moderatorTeamID || [],
      createdBy: createdById
    });

    return {
      status: true,
      message: "Monitor team created successfully.",
      data: newMonitorTeam
    };
  } catch (e) {
    return {
      status: false,
      message: "Failed to create monitor team.",
      details: e.message
    };
  }
};

// Get All Monitor Teams
export const GetAllMonitorTeamsService = async () => {
  try {
    const monitorTeams = await MonitorTeamModel.find()
      .populate("teamMonitor", "name email phone role profileImage")
      .populate({
        path: "moderatorTeamID",
        populate: {
          path: "moderatorName",
          select: "name email phone role profileImage"
        }
      })
      .populate("createdBy", "name email phone role profileImage")
      .populate("updatedBy", "name email phone role profileImage")
      .sort({ createdAt: -1 })
      .lean();
    
    // Count total monitor teams
    const totalTeams = monitorTeams.length;

    // Count total moderator
    const totalModeratorTeam = monitorTeams.reduce((total, team) => {
      return total + (team.moderatorTeamID ? team.moderatorTeamID.length : 0);
    }, 0);

    // Count total moderator teams
    const totalModerator = monitorTeams.reduce((total, team) => {
      return total + (team.moderatorTeamID ? team.moderatorTeamID.length : 0);
    }, 0);

    // Count total members in moderator teams
    const totalModeratorTeamMembers = await ModeratorTeamModel.aggregate([
      {
        $project: {
          memberCount: { $size: { $ifNull: ["$moderatorTeamMembers", []] } }
        }
      },
      {
        $group: {
          _id: null,
          totalMembers: { $sum: "$memberCount" }
        }
      }
    ]);
    // Count total members in moderator teams and add total moderator
    const totalMembers = totalModeratorTeamMembers[0]?.totalMembers + totalModerator || 0;
    
    // Add counts to the monitor teams data
    const monitorTeamsWithCounts = {
      teams: monitorTeams,
      totalTeams,
      totalModeratorTeam,
      totalModerator,
      totalMembers
    };
    
    if (!monitorTeams || monitorTeams.length === 0) {
      return {
        status: false,
        message: "No monitor teams found."
      };
    }
    
    return {
      status: true,
      message: "All monitor teams retrieved successfully.",
      data: monitorTeamsWithCounts
    };
  } catch (e) {
    return {
      status: false,
      message: "Failed to retrieve monitor teams.",
      details: e.message
    };
  }
};

// Get Monitor Team By ID
export const GetMonitorTeamByIdService = async (req) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return {
        status: false,
        message: "Invalid monitor team ID."
      };
    }
    
    const monitorTeam = await MonitorTeamModel.findById(id)
      .populate("teamMonitor", "name email phone role profileImage")
      .populate({
        path: "moderatorTeamID",
        populate: {
          path: "moderatorName",
          select: "name email phone role profileImage"
        }
      })
      .populate("createdBy", "name email phone role profileImage")
      .populate("updatedBy", "name email phone role profileImage")
      .lean();
    
    if (!monitorTeam) {
      return {
        status: false,
        message: "Monitor team not found."
      };
    }

        // Count total moderator teams
        const totalModeratorTeam = await ModeratorTeamModel.countDocuments();

        // Count total moderators (unique moderatorName entries)
        const moderators = await ModeratorTeamModel.distinct('moderatorName');
        const totalModerator = moderators.length;
    
        // Count total members in moderator teams
        const totalModeratorTeamMembers = await ModeratorTeamModel.aggregate([
          {
            $project: {
              memberCount: { $size: { $ifNull: ["$moderatorTeamMembers", []] } }
            }
          },
          {
            $group: {
              _id: null,
              totalMembers: { $sum: "$memberCount" }
            }
          }
        ]);
    
        // Count total members in moderator teams and add total moderator
        const totalMembers = (totalModeratorTeamMembers[0]?.totalMembers || 0) + totalModerator;
    
    return {
      status: true,
      message: "Monitor team retrieved successfully.",
      data: {
        monitorTeam,
        totalModeratorTeam,
        totalModerator,
        totalMembers
      }
    };
  } catch (e) {
    return {
      status: false,
      message: "Failed to retrieve monitor team.",
      details: e.message
    };
  }
};

// Update Monitor Team
export const UpdateMonitorTeamService = async (req) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return {
        status: false,
        message: "Invalid monitor team ID."
      };
    }
    
    // Get user ID from headers or cookies for updatedBy field
    const updatedById = req.headers.user_id || (req.cookies && req.cookies.user_id);
    
    if (!updatedById || !ObjectId.isValid(updatedById)) {
      return {
        status: false,
        message: "Valid user ID is required in headers or cookies."
      };
    }
    
    // Check if team exists
    const existingTeam = await MonitorTeamModel.findById(id);
    if (!existingTeam) {
      return {
        status: false,
        message: "Monitor team not found."
      };
    }
    
    const reqBody = req.body;
    const { teamName, teamMonitor, moderatorTeamID } = reqBody;
    
    // Update object with fields that are provided
    const updateObj = { updatedBy: updatedById };
    
    if (teamName) updateObj.teamName = teamName;
    
    // If team monitor is being updated
    if (teamMonitor && ObjectId.isValid(teamMonitor)) {
      const user = await UserModel.findById(teamMonitor);
      if (!user) {
        return {
          status: false,
          message: "Monitor not found with this ID."
        };
      }
      
      if (user.role !== "Monitor") {
        return {
          status: false,
          message: "You have to set this user as a monitor first."
        };
      }
      
      // Check if monitor is already in another team
      const existingMonitor = await MonitorTeamModel.findOne({ 
        teamMonitor, 
        _id: { $ne: id } 
      });
      
      if (existingMonitor) {
        return {
          status: false,
          message: "Monitor is already in another team."
        };
      }
      
      updateObj.teamMonitor = teamMonitor;
    }
    
    // If moderator teams are being updated
    if (moderatorTeamID && moderatorTeamID.length > 0) {
      // Check if moderator teams exist
      const teamsCount = await ModeratorTeamModel.countDocuments({
        _id: { $in: moderatorTeamID }
      });
      
      if (teamsCount !== moderatorTeamID.length) {
        return {
          status: false,
          message: "One or more moderator teams not found."
        };
      }
      
      // Check if moderator teams are already assigned to another monitor team
      const assignedTeams = await MonitorTeamModel.find({
        _id: { $ne: id },
        moderatorTeamID: { $in: moderatorTeamID }
      });
      
      if (assignedTeams.length > 0) {
        return {
          status: false,
          message: "One or more moderator teams are already assigned to another monitor team."
        };
      }
      
      updateObj.moderatorTeamID = moderatorTeamID;
    }
    
    // Update the team
    const updatedTeam = await MonitorTeamModel.findByIdAndUpdate(
      id,
      updateObj,
      { new: true }
    )
    .populate("teamMonitor", "name email phone role profileImage")
    .populate({
      path: "moderatorTeamID",
      populate: {
        path: "moderatorName",
        select: "name email phone role profileImage"
      }
    })
    .populate("createdBy", "name email phone role profileImage")
    .populate("updatedBy", "name email phone role profileImage");
    
    return {
      status: true,
      message: "Monitor team updated successfully.",
      data: updatedTeam
    };
  } catch (e) {
    return {
      status: false,
      message: "Failed to update monitor team.",
      details: e.message
    };
  }
};

// Delete Monitor Team
export const DeleteMonitorTeamService = async (req) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return {
        status: false,
        message: "Invalid monitor team ID."
      };
    }
    
    // Check if team exists
    const existingTeam = await MonitorTeamModel.findById(id);
    if (!existingTeam) {
      return {
        status: false,
        message: "Monitor team not found."
      };
    }
    
    // Delete the team
    await MonitorTeamModel.findByIdAndDelete(id);
    
    return {
      status: true,
      message: "Monitor team deleted successfully."
    };
  } catch (e) {
    return {
      status: false,
      message: "Failed to delete monitor team.",
      details: e.message
    };
  }
};
