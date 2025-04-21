import {
  CreateBoardTeamService,
  GetAllBoardTeamService,
  GetBoardTeamByIdService,
  UpdateBoardTeamService,
  DeleteBoardTeamService,
  ToggleBoardTeamActiveService,
  ToggleBoardTeamFeaturedService,
  UpdateBoardTeamOrderService
} from '../service/BoardTeamService.js';

// Create Board Team Member
export const CreateBoardTeam = async (req, res) => {
  try {
    const result = await CreateBoardTeamService(req);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error creating board team member",
      error: error.message
    });
  }
};

// Get All Board Team Members
export const GetAllBoardTeam = async (req, res) => {
  try {
    const result = await GetAllBoardTeamService(req);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error retrieving board team members",
      error: error.message
    });
  }
};

// Get Board Team Member By ID
export const GetBoardTeamById = async (req, res) => {
  try {
    const result = await GetBoardTeamByIdService(req);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error retrieving board team member",
      error: error.message
    });
  }
};

// Update Board Team Member
export const UpdateBoardTeam = async (req, res) => {
  try {
    const result = await UpdateBoardTeamService(req);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error updating board team member",
      error: error.message
    });
  }
};

// Delete Board Team Member
export const DeleteBoardTeam = async (req, res) => {
  try {
    const result = await DeleteBoardTeamService(req);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error deleting board team member",
      error: error.message
    });
  }
};

// Toggle Board Team Member Active Status
export const ToggleBoardTeamActive = async (req, res) => {
  try {
    const result = await ToggleBoardTeamActiveService(req);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error toggling board team member status",
      error: error.message
    });
  }
};

// Toggle Board Team Member Featured Status
export const ToggleBoardTeamFeatured = async (req, res) => {
  try {
    const result = await ToggleBoardTeamFeaturedService(req);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error toggling board team member featured status",
      error: error.message
    });
  }
};

// Update Board Team Member Order
export const UpdateBoardTeamOrder = async (req, res) => {
  try {
    const result = await UpdateBoardTeamOrderService(req);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error updating board team member order",
      error: error.message
    });
  }
}; 