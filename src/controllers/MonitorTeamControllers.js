import {
  CreateMonitorTeamService,
  GetAllMonitorTeamsService,
  GetMonitorTeamByIdService,
  UpdateMonitorTeamService,
  DeleteMonitorTeamService,
  GetMonitorTeamByMonitorUserIdService,
} from '../service/MonitorTeamService.js';

// Create Monitor Team
export const CreateMonitorTeam = async (req, res) => {
  try {
    const result = await CreateMonitorTeamService(req);
    
    if (result.status) {
      return res.status(201).json(result);
    } else {
      return res.status(404).json(result);
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
    const result = await GetAllMonitorTeamsService(req);
    
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
    const result = await GetMonitorTeamByIdService(req);
    
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

// Get Monitor Team By Monitor User ID
export const GetMonitorTeamByMonitorUserId = async (req, res) => {
  try {
    const result = await GetMonitorTeamByMonitorUserIdService(req);
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

// Update Monitor Team
export const UpdateMonitorTeam = async (req, res) => {
  try {
    const result = await UpdateMonitorTeamService(req);
    
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
    const result = await DeleteMonitorTeamService(req);
    
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
