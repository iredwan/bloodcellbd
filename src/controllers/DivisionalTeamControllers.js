import {
  CreateDivisionalTeamService,
  GetAllDivisionalTeamService,
  GetDivisionalTeamByIdService,
  GetDivisionalTeamByDivisionService,
  UpdateDivisionalTeamService,
  DeleteDivisionalTeamService,
  ToggleDivisionalTeamActiveService,
  ToggleDivisionalTeamFeaturedService,
  UpdateDivisionalTeamOrderService
} from '../service/DivisionalTeamService.js';

// Create Divisional Team Member
export const CreateDivisionalTeam = async (req, res) => {
  try {
    const result = await CreateDivisionalTeamService(req);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error creating divisional team member",
      error: error.message
    });
  }
};

// Get All Divisional Team Members
export const GetAllDivisionalTeam = async (req, res) => {
  try {
    const result = await GetAllDivisionalTeamService(req);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error retrieving divisional team members",
      error: error.message
    });
  }
};

// Get Divisional Team Member By ID
export const GetDivisionalTeamById = async (req, res) => {
  try {
    const result = await GetDivisionalTeamByIdService(req);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error retrieving divisional team member",
      error: error.message
    });
  }
};

// Get Divisional Team Members By Division
export const GetDivisionalTeamByDivision = async (req, res) => {
  try {
    const result = await GetDivisionalTeamByDivisionService(req);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error retrieving divisional team members by division",
      error: error.message
    });
  }
};

// Update Divisional Team Member
export const UpdateDivisionalTeam = async (req, res) => {
  try {
    const result = await UpdateDivisionalTeamService(req);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error updating divisional team member",
      error: error.message
    });
  }
};

// Delete Divisional Team Member
export const DeleteDivisionalTeam = async (req, res) => {
  try {
    const result = await DeleteDivisionalTeamService(req);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error deleting divisional team member",
      error: error.message
    });
  }
};

// Toggle Divisional Team Member Active Status
export const ToggleDivisionalTeamActive = async (req, res) => {
  try {
    const result = await ToggleDivisionalTeamActiveService(req);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error toggling divisional team member status",
      error: error.message
    });
  }
};

// Toggle Divisional Team Member Featured Status
export const ToggleDivisionalTeamFeatured = async (req, res) => {
  try {
    const result = await ToggleDivisionalTeamFeaturedService(req);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error toggling divisional team member featured status",
      error: error.message
    });
  }
};

// Update Divisional Team Member Order
export const UpdateDivisionalTeamOrder = async (req, res) => {
  try {
    const result = await UpdateDivisionalTeamOrderService(req);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error updating divisional team member order",
      error: error.message
    });
  }
}; 