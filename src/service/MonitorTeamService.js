import MonitorTeamModel from "../models/MonitorTeamModel.js";
import mongoose from "mongoose";
import userModel from "../models/UserModel.js";

const ObjectId = mongoose.Types.ObjectId;

// Create Monitor Team
export const CreateMonitorTeamService = async (body) => {
  try {
    const teamMonitor = body.teamMonitor;
    const { designation, moderatorTeamID } = body;

    const user = await userModel.findById(teamMonitor);

    if (!user) {
      return {
        status: false,
        message: "Team monitor not found."
      };
    }

    const teamName = user.name + "'s Team";

    // Check if required fields are provided
    if (!teamName || !teamMonitor || !moderatorTeamID) {
      return {
        status: false,
        message: "Team name, team monitor, and moderator team ID are required."
      };
    }

    // Check if team name already exists
    const existingTeam = await MonitorTeamModel.findOne({ teamName });
    if (existingTeam) {
      return {
        status: false,
        message: "Team with this name already exists."
      };
    }

    // Create new monitor team
    const newMonitorTeam = await MonitorTeamModel.create({
      teamName,
      teamMonitor,
      designation: designation || "Monitor",
      moderatorTeamID
    });

    // Populate references for response
    const populatedTeam = await MonitorTeamModel.findById(newMonitorTeam._id)
      .populate("teamMonitor", "name email phone")
      .populate("moderatorTeamID", "moderatorTeamName");

    return {
      status: true,
      message: "Monitor team created successfully.",
      data: populatedTeam
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
      .populate("teamMonitor", "name email phone role")
      .populate("moderatorTeamID", "moderatorTeamName, moderatorName")
      .sort({ createdAt: -1 });
    
    if (!monitorTeams || monitorTeams.length === 0) {
      return {
        status: false,
        message: "No monitor teams found."
      };
    }
    
    return {
      status: true,
      message: "All monitor teams retrieved successfully.",
      data: monitorTeams
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
export const GetMonitorTeamByIdService = async (id) => {
  try {
    if (!ObjectId.isValid(id)) {
      return {
        status: false,
        message: "Invalid monitor team ID."
      };
    }
    
    const monitorTeam = await MonitorTeamModel.findById(id)
      .populate("teamMonitor", "name email phone role")
      .populate("moderatorTeamID", "moderatorTeamName, moderatorName");
    
    if (!monitorTeam) {
      return {
        status: false,
        message: "Monitor team not found."
      };
    }
    
    return {
      status: true,
      message: "Monitor team retrieved successfully.",
      data: monitorTeam
    };
  } catch (e) {
    return {
      status: false,
      message: "Failed to retrieve monitor team.",
      details: e.message
    };
  }
};

// Get Monitor Teams By Moderator Team ID
export const GetMonitorTeamsByModeratorTeamService = async (moderatorTeamId) => {
  try {
    if (!ObjectId.isValid(moderatorTeamId)) {
      return {
        status: false,
        message: "Invalid moderator team ID."
      };
    }
    
    const monitorTeams = await MonitorTeamModel.find({ moderatorTeamID: moderatorTeamId })
      .populate("teamMonitor", "name email phone")
      .populate("moderatorTeamID", "moderatorTeamName")
      .sort({ createdAt: -1 });
    
    if (!monitorTeams || monitorTeams.length === 0) {
      return {
        status: false,
        message: "No monitor teams found for this moderator team."
      };
    }
    
    return {
      status: true,
      message: "Monitor teams retrieved successfully.",
      data: monitorTeams
    };
  } catch (e) {
    return {
      status: false,
      message: "Failed to retrieve monitor teams.",
      details: e.message
    };
  }
};

// Update Monitor Team
export const UpdateMonitorTeamService = async (id, body) => {
  try {
    if (!ObjectId.isValid(id)) {
      return {
        status: false,
        message: "Invalid monitor team ID."
      };
    }
    
    // Check if monitor team exists
    const existingTeam = await MonitorTeamModel.findById(id);
    if (!existingTeam) {
      return {
        status: false,
        message: "Monitor team not found."
      };
    }
    
    // Check if team name already exists (if updating team name)
    if (body.teamName && body.teamName !== existingTeam.teamName) {
      const teamWithName = await MonitorTeamModel.findOne({ 
        teamName: body.teamName,
        _id: { $ne: id }
      });
      
      if (teamWithName) {
        return {
          status: false,
          message: "Another monitor team with this name already exists."
        };
      }
    }
    
    // Update monitor team
    const updatedMonitorTeam = await MonitorTeamModel.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    )
    .populate("teamMonitor", "name email phone")
    .populate("moderatorTeamID", "moderatorTeamName");
    
    return {
      status: true,
      message: "Monitor team updated successfully.",
      data: updatedMonitorTeam
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
export const DeleteMonitorTeamService = async (id) => {
  try {
    if (!ObjectId.isValid(id)) {
      return {
        status: false,
        message: "Invalid monitor team ID."
      };
    }
    
    // Check if monitor team exists
    const existingTeam = await MonitorTeamModel.findById(id);
    if (!existingTeam) {
      return {
        status: false,
        message: "Monitor team not found."
      };
    }
    
    // Delete monitor team
    const deletedMonitorTeam = await MonitorTeamModel.findByIdAndDelete(id);
    
    return {
      status: true,
      message: "Monitor team deleted successfully.",
      data: deletedMonitorTeam
    };
  } catch (e) {
    return {
      status: false,
      message: "Failed to delete monitor team.",
      details: e.message
    };
  }
};

// Change Monitor Team Moderator
export const ChangeTeamMonitorService = async (id, newMonitorId) => {
  try {
    if (!ObjectId.isValid(id) || !ObjectId.isValid(newMonitorId)) {
      return {
        status: false,
        message: "Invalid team ID or monitor ID."
      };
    }
    
    // Check if monitor team exists
    const existingTeam = await MonitorTeamModel.findById(id);
    if (!existingTeam) {
      return {
        status: false,
        message: "Monitor team not found."
      };
    }
    
    // Update team monitor
    const updatedTeam = await MonitorTeamModel.findByIdAndUpdate(
      id,
      { $set: { teamMonitor: newMonitorId } },
      { new: true, runValidators: true }
    )
    .populate("teamMonitor", "name email phone")
    .populate("moderatorTeamID", "moderatorTeamName");
    
    return {
      status: true,
      message: "Team monitor changed successfully.",
      data: updatedTeam
    };
  } catch (e) {
    return {
      status: false,
      message: "Failed to change team monitor.",
      details: e.message
    };
  }
};
