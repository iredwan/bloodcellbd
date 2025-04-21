import {
  CreateDistrictTeamService,
  GetAllDistrictTeamService,
  GetDistrictTeamByIdService,
  GetDistrictTeamByDistrictService,
  UpdateDistrictTeamService,
  DeleteDistrictTeamService,
  ToggleDistrictTeamActiveService,
  ToggleDistrictTeamFeaturedService,
  UpdateDistrictTeamOrderService
} from '../service/DistrictTeamService.js';

// Create District Team Member
export const CreateDistrictTeam = async (req, res) => {
  try {
    const result = await CreateDistrictTeamService(req);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error creating district team member",
      error: error.message
    });
  }
};

// Get All District Team Members
export const GetAllDistrictTeam = async (req, res) => {
  try {
    const result = await GetAllDistrictTeamService(req);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error retrieving district team members",
      error: error.message
    });
  }
};

// Get District Team Member By ID
export const GetDistrictTeamById = async (req, res) => {
  try {
    const result = await GetDistrictTeamByIdService(req);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error retrieving district team member",
      error: error.message
    });
  }
};

// Get District Team Members By District
export const GetDistrictTeamByDistrict = async (req, res) => {
  try {
    const result = await GetDistrictTeamByDistrictService(req);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error retrieving district team members by district",
      error: error.message
    });
  }
};

// Update District Team Member
export const UpdateDistrictTeam = async (req, res) => {
  try {
    const result = await UpdateDistrictTeamService(req);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error updating district team member",
      error: error.message
    });
  }
};

// Delete District Team Member
export const DeleteDistrictTeam = async (req, res) => {
  try {
    const result = await DeleteDistrictTeamService(req);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error deleting district team member",
      error: error.message
    });
  }
};

// Toggle District Team Member Active Status
export const ToggleDistrictTeamActive = async (req, res) => {
  try {
    const result = await ToggleDistrictTeamActiveService(req);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error toggling district team member status",
      error: error.message
    });
  }
};

// Toggle District Team Member Featured Status
export const ToggleDistrictTeamFeatured = async (req, res) => {
  try {
    const result = await ToggleDistrictTeamFeaturedService(req);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error toggling district team member featured status",
      error: error.message
    });
  }
};

// Update District Team Member Order
export const UpdateDistrictTeamOrder = async (req, res) => {
  try {
    const result = await UpdateDistrictTeamOrderService(req);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error updating district team member order",
      error: error.message
    });
  }
}; 