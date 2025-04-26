import {
  CreateMonitorTeamService,
  GetAllMonitorTeamsService,
  GetMonitorTeamByIdService,
  GetMonitorTeamsByModeratorTeamService,
  UpdateMonitorTeamService,
  DeleteMonitorTeamService,
  ChangeTeamMonitorService
} from '../service/MonitorTeamService.js';

// Create Monitor Team
export const CreateMonitorTeam = async (req, res) => {
  try {
    const result = await CreateMonitorTeamService(req.body);
    
    if (result.status) {
      return res.status(201).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error creating monitor team",
      error: error.message
    });
  }
};

// Get All Monitor Teams
export const GetAllMonitorTeams = async (req, res) => {
  try {
    const result = await GetAllMonitorTeamsService();
    
    if (result.status) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error retrieving monitor teams",
      error: error.message
    });
  }
};

// Get Monitor Team By ID
export const GetMonitorTeamById = async (req, res) => {
  try {
    const result = await GetMonitorTeamByIdService(req.params.id);
    
    if (result.status) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error retrieving monitor team",
      error: error.message
    });
  }
};

// Get Monitor Teams By Moderator Team ID
export const GetMonitorTeamsByModeratorTeam = async (req, res) => {
  try {
    const result = await GetMonitorTeamsByModeratorTeamService(req.params.moderatorTeamId);
    
    if (result.status) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error retrieving monitor teams",
      error: error.message
    });
  }
};

// Update Monitor Team
export const UpdateMonitorTeam = async (req, res) => {
  try {
    const result = await UpdateMonitorTeamService(req.params.id, req.body);
    
    if (result.status) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error updating monitor team",
      error: error.message
    });
  }
};

// Delete Monitor Team
export const DeleteMonitorTeam = async (req, res) => {
  try {
    const result = await DeleteMonitorTeamService(req.params.id);
    
    if (result.status) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error deleting monitor team",
      error: error.message
    });
  }
};

// Change Team Monitor
export const ChangeTeamMonitor = async (req, res) => {
  try {
    const { teamId, newMonitorId } = req.params;
    
    const result = await ChangeTeamMonitorService(teamId, newMonitorId);
    
    if (result.status) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error changing team monitor",
      error: error.message
    });
  }
}; 