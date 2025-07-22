import {
  CreateModeratorTeamService,
  GetAllModeratorTeamsService,
  GetModeratorTeamByIdService,
  UpdateModeratorTeamService,
  DeleteModeratorTeamService,
  AddTeamMemberService,
  RemoveTeamMemberService,
  GetModeratorTeamByModeratorUserIdService,
  GetAllModeratorTeamsByMonitorUserIdService,
  GetAllModeratorTeamsByMemberUserIdService
} from '../service/ModeratorTeamService.js';

// Create Moderator Team
export const CreateModeratorTeam = async (req, res) => {
  try {
    const result = await CreateModeratorTeamService(req);
    
    if (result.status) {
      return res.status(201).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error creating moderator team",
      error: error.message
    });
  }
};

// Get All Moderator Teams
export const GetAllModeratorTeams = async (req, res) => {
  try {
    const result = await GetAllModeratorTeamsService(req);
    
    if (result.status) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error retrieving moderator teams",
      error: error.message
    });
  }
};

// Get Moderator Team By ID
export const GetModeratorTeamById = async (req, res) => {
  try {
    const result = await GetModeratorTeamByIdService(req);
    
    if (result.status) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error retrieving moderator team",
      error: error.message
    });
  }
};

// Get Moderator Team By Moderator User ID
export const GetModeratorTeamByModeratorUserId = async (req, res) => {
  try {
    const result = await GetModeratorTeamByModeratorUserIdService(req);
    if (result.status) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error retrieving moderator team",
      error: error.message
    });
  }
} 
// Update Moderator Team
export const UpdateModeratorTeam = async (req, res) => {
  try {
    const result = await UpdateModeratorTeamService(req);
    
    if (result.status) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error updating moderator team",
      error: error.message
    });
  }
};

// Delete Moderator Team
export const DeleteModeratorTeam = async (req, res) => {
  try {
    const result = await DeleteModeratorTeamService(req);
    
    if (result.status) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error deleting moderator team",
      error: error.message
    });
  }
};

// Add Member to Team
export const AddTeamMember = async (req, res) => {
  try {
    const result = await AddTeamMemberService(req);
    
    if (result.status) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error adding member to team",
      error: error.message
    });
  }
};

// Remove Member from Team
export const RemoveTeamMember = async (req, res) => {
  try {
    const result = await RemoveTeamMemberService(req);
    
    if (result.status) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error removing member from team",
      error: error.message
    });
  }
}; 

// Get All Moderator Teams By Monitor User ID
export const GetAllModeratorTeamsByMonitorUserId = async (req, res) => {
  try {
    const result = await GetAllModeratorTeamsByMonitorUserIdService(req);
    if (result.status) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error retrieving moderator teams",
      error: error.message
    });
  }
};

// Get Moderator Team By Member User ID
export const GetModeratorTeamByMemberUserId = async (req, res) => {
  try {
    const result = await GetAllModeratorTeamsByMemberUserIdService(req);
    if (result.status) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error retrieving moderator teams",
      error: error.message
    });
  }
}
