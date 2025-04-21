import {
  CreateUpazilaTeamService,
  GetAllUpazilaTeamService,
  GetUpazilaTeamByIdService,
  GetUpazilaTeamByDistrictService,
  GetUpazilaTeamByUpazilaService,
  UpdateUpazilaTeamService,
  DeleteUpazilaTeamService,
  ToggleUpazilaTeamActiveService,
  ToggleUpazilaTeamFeaturedService,
  UpdateUpazilaTeamOrderService
} from '../service/UpazilaTeamService.js';

// Create Upazila Team Member
export const CreateUpazilaTeam = async (req, res) => {
  try {
    const result = await CreateUpazilaTeamService(req);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error creating upazila team member",
      error: error.message
    });
  }
};

// Get All Upazila Team Members
export const GetAllUpazilaTeam = async (req, res) => {
  try {
    const result = await GetAllUpazilaTeamService(req);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error retrieving upazila team members",
      error: error.message
    });
  }
};

// Get Upazila Team Member By ID
export const GetUpazilaTeamById = async (req, res) => {
  try {
    const result = await GetUpazilaTeamByIdService(req);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error retrieving upazila team member",
      error: error.message
    });
  }
};

// Get Upazila Team Members By District
export const GetUpazilaTeamByDistrict = async (req, res) => {
  try {
    const result = await GetUpazilaTeamByDistrictService(req);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error retrieving upazila team members by district",
      error: error.message
    });
  }
};

// Get Upazila Team Members By Upazila
export const GetUpazilaTeamByUpazila = async (req, res) => {
  try {
    const result = await GetUpazilaTeamByUpazilaService(req);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error retrieving upazila team members by upazila",
      error: error.message
    });
  }
};

// Update Upazila Team Member
export const UpdateUpazilaTeam = async (req, res) => {
  try {
    const result = await UpdateUpazilaTeamService(req);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error updating upazila team member",
      error: error.message
    });
  }
};

// Delete Upazila Team Member
export const DeleteUpazilaTeam = async (req, res) => {
  try {
    const result = await DeleteUpazilaTeamService(req);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error deleting upazila team member",
      error: error.message
    });
  }
};

// Toggle Upazila Team Member Active Status
export const ToggleUpazilaTeamActive = async (req, res) => {
  try {
    const result = await ToggleUpazilaTeamActiveService(req);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error toggling upazila team member status",
      error: error.message
    });
  }
};

// Toggle Upazila Team Member Featured Status
export const ToggleUpazilaTeamFeatured = async (req, res) => {
  try {
    const result = await ToggleUpazilaTeamFeaturedService(req);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error toggling upazila team member featured status",
      error: error.message
    });
  }
};

// Update Upazila Team Member Order
export const UpdateUpazilaTeamOrder = async (req, res) => {
  try {
    const result = await UpdateUpazilaTeamOrderService(req);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error updating upazila team member order",
      error: error.message
    });
  }
}; 