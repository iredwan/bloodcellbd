import {
  CreateDivisionalTeamService,
  GetAllDivisionalTeamsService,
  GetDivisionalTeamByIdService,
  UpdateDivisionalTeamService,
  DeleteDivisionalTeamService,
  GetDivisionalTeamByDivisionalCoordinatorsUserIdService
} from '../service/DivisionalTeamService.js';

// Create Divisional Team
export const CreateDivisionalTeam = async (req, res) => {
  try {
    const result = await CreateDivisionalTeamService(req);
    
    if (result.status) {
      return res.status(201).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error creating divisional team",
      error: error.message
    });
  }
};

// Get All Divisional Teams
export const GetAllDivisionalTeams = async (req, res) => {
  try {
    const result = await GetAllDivisionalTeamsService();
    
    if (result.status) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error retrieving divisional teams",
      error: error.message
    });
  }
};

// Get Divisional Team By ID
export const GetDivisionalTeamById = async (req, res) => {
  try {
    const result = await GetDivisionalTeamByIdService(req);
    
    if (result.status) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error retrieving divisional team",
      error: error.message
    });
  }
};

// Update Divisional Team
export const UpdateDivisionalTeam = async (req, res) => {
  try {
    const result = await UpdateDivisionalTeamService(req);
    
    if (result.status) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error updating divisional team",
      error: error.message
    });
  }
};

// Get Divisional Team By Divisional Coordinators User ID
export const GetDivisionalTeamByDivisionalCoordinatorsUserId = async (req, res) => {
  try {
    const result = await GetDivisionalTeamByDivisionalCoordinatorsUserIdService(req, res);
    if (result.status) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error retrieving divisional team",
      error: error.message
    });
  }
};


// Delete Divisional Team
export const DeleteDivisionalTeam = async (req, res) => {
  try {
    const result = await DeleteDivisionalTeamService(req);
    
    if (result.status) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error deleting divisional team",
      error: error.message
    });
  }
}; 