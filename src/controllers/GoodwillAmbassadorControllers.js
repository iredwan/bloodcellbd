import {
  CreateGoodwillAmbassadorService,
  GetAllGoodwillAmbassadorsService,
  GetGoodwillAmbassadorByIdService,
  UpdateGoodwillAmbassadorService,
  DeleteGoodwillAmbassadorService,
  ToggleGoodwillAmbassadorActiveService,
  ToggleGoodwillAmbassadorFeaturedService,
  AddEventToGoodwillAmbassadorService,
  RemoveEventFromGoodwillAmbassadorService
} from '../service/GoodwillAmbassadorService.js';

// Create Goodwill Ambassador
export const CreateGoodwillAmbassador = async (req, res) => {
  try {
    const result = await CreateGoodwillAmbassadorService(req);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error creating Goodwill Ambassador",
      error: error.message
    });
  }
};

// Get All Goodwill Ambassadors
export const GetAllGoodwillAmbassadors = async (req, res) => {
  try {
    const result = await GetAllGoodwillAmbassadorsService(req);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error retrieving Goodwill Ambassadors",
      error: error.message
    });
  }
};

// Get Goodwill Ambassador By ID
export const GetGoodwillAmbassadorById = async (req, res) => {
  try {
    const result = await GetGoodwillAmbassadorByIdService(req);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error retrieving Goodwill Ambassador",
      error: error.message
    });
  }
};

// Update Goodwill Ambassador
export const UpdateGoodwillAmbassador = async (req, res) => {
  try {
    const result = await UpdateGoodwillAmbassadorService(req);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error updating Goodwill Ambassador",
      error: error.message
    });
  }
};

// Delete Goodwill Ambassador
export const DeleteGoodwillAmbassador = async (req, res) => {
  try {
    const result = await DeleteGoodwillAmbassadorService(req);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error deleting Goodwill Ambassador",
      error: error.message
    });
  }
};

// Toggle Goodwill Ambassador Active Status
export const ToggleGoodwillAmbassadorActive = async (req, res) => {
  try {
    const result = await ToggleGoodwillAmbassadorActiveService(req);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error toggling Goodwill Ambassador status",
      error: error.message
    });
  }
};

// Toggle Goodwill Ambassador Featured Status
export const ToggleGoodwillAmbassadorFeatured = async (req, res) => {
  try {
    const result = await ToggleGoodwillAmbassadorFeaturedService(req);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error toggling Goodwill Ambassador featured status",
      error: error.message
    });
  }
};

// Add Event to Goodwill Ambassador
export const AddEventToGoodwillAmbassador = async (req, res) => {
  try {
    const result = await AddEventToGoodwillAmbassadorService(req);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error adding event to Goodwill Ambassador",
      error: error.message
    });
  }
};

// Remove Event from Goodwill Ambassador
export const RemoveEventFromGoodwillAmbassador = async (req, res) => {
  try {
    const result = await RemoveEventFromGoodwillAmbassadorService(req);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error removing event from Goodwill Ambassador",
      error: error.message
    });
  }
}; 