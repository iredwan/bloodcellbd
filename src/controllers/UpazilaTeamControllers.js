import {
  CreateUpazilaTeamService,
  GetAllUpazilaTeamsService,
  GetUpazilaTeamByIdService,
  UpdateUpazilaTeamService,
  DeleteUpazilaTeamService
} from '../service/UpazilaTeamService.js';

// Create Upazila Team
export const CreateUpazilaTeam = async (req, res) => {
  try {
    const result = await CreateUpazilaTeamService(req);
    
    if (result.status) {
      return res.status(201).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error creating upazila team",
      error: error.message
    });
  }
};

// Get All Upazila Teams
export const GetAllUpazilaTeams = async (req, res) => {
  try {
    const result = await GetAllUpazilaTeamsService();
    
    if (result.status) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error retrieving upazila teams",
      error: error.message
    });
  }
};

// Get Upazila Team By ID
export const GetUpazilaTeamById = async (req, res) => {
  try {
    const result = await GetUpazilaTeamByIdService(req);
    
    if (result.status) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error retrieving upazila team",
      error: error.message
    });
  }
};

// Update Upazila Team
export const UpdateUpazilaTeam = async (req, res) => {
  try {
    const result = await UpdateUpazilaTeamService(req);
    
    if (result.status) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error updating upazila team",
      error: error.message
    });
  }
};

// Delete Upazila Team
export const DeleteUpazilaTeam = async (req, res) => {
  try {
    const result = await DeleteUpazilaTeamService(req);
    
    if (result.status) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error deleting upazila team",
      error: error.message
    });
  }
};
