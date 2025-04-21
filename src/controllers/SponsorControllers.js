import {
  CreateSponsorService,
  GetAllSponsorsService,
  GetSponsorByIdService,
  UpdateSponsorService,
  DeleteSponsorService,
  ToggleSponsorActiveService,
  AddEventToSponsorService,
  RemoveEventFromSponsorService,
  GetSponsorsByTypeService
} from '../service/SponsorService.js';

// Create Sponsor
export const CreateSponsor = async (req, res) => {
  try {
    const result = await CreateSponsorService(req);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error creating sponsor",
      error: error.message
    });
  }
};

// Get All Sponsors
export const GetAllSponsors = async (req, res) => {
  try {
    const result = await GetAllSponsorsService(req);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error retrieving sponsors",
      error: error.message
    });
  }
};

// Get Sponsor By ID
export const GetSponsorById = async (req, res) => {
  try {
    const result = await GetSponsorByIdService(req);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error retrieving sponsor",
      error: error.message
    });
  }
};

// Update Sponsor
export const UpdateSponsor = async (req, res) => {
  try {
    const result = await UpdateSponsorService(req);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error updating sponsor",
      error: error.message
    });
  }
};

// Delete Sponsor
export const DeleteSponsor = async (req, res) => {
  try {
    const result = await DeleteSponsorService(req);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error deleting sponsor",
      error: error.message
    });
  }
};

// Toggle Sponsor Active Status
export const ToggleSponsorActive = async (req, res) => {
  try {
    const result = await ToggleSponsorActiveService(req);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error toggling sponsor status",
      error: error.message
    });
  }
};

// Add Event to Sponsor
export const AddEventToSponsor = async (req, res) => {
  try {
    const result = await AddEventToSponsorService(req);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error adding event to sponsor",
      error: error.message
    });
  }
};

// Remove Event from Sponsor
export const RemoveEventFromSponsor = async (req, res) => {
  try {
    const result = await RemoveEventFromSponsorService(req);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error removing event from sponsor",
      error: error.message
    });
  }
};

// Get Sponsors by Type
export const GetSponsorsByType = async (req, res) => {
  try {
    const result = await GetSponsorsByTypeService(req);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error retrieving sponsors by type",
      error: error.message
    });
  }
}; 