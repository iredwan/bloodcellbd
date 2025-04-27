import {
  CreateDistrictTeamService,
  GetAllDistrictTeamsService,
  GetDistrictTeamByIdService,
  UpdateDistrictTeamService,
  DeleteDistrictTeamService
} from '../service/DistrictTeamService.js';

// Create District Team
export const CreateDistrictTeam = async (req, res) => {
  try {
    const result = await CreateDistrictTeamService(req);
    
    if (result.status) {
      return res.status(201).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error creating district team",
      error: error.message
    });
  }
};

// Get All District Teams
export const GetAllDistrictTeams = async (req, res) => {
  try {
    const result = await GetAllDistrictTeamsService();
    
    if (result.status) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error retrieving district teams",
      error: error.message
    });
  }
};

// Get District Team By ID
export const GetDistrictTeamById = async (req, res) => {
  try {
    const result = await GetDistrictTeamByIdService(req);
    
    if (result.status) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error retrieving district team",
      error: error.message
    });
  }
};

// Update District Team
export const UpdateDistrictTeam = async (req, res) => {
  try {
    const result = await UpdateDistrictTeamService(req);
    
    if (result.status) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error updating district team",
      error: error.message
    });
  }
};

// Delete District Team
export const DeleteDistrictTeam = async (req, res) => {
  try {
    const result = await DeleteDistrictTeamService(req);
    
    if (result.status) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error deleting district team",
      error: error.message
    });
  }
}; 