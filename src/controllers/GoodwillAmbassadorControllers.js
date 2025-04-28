import {
  CreateGoodwillAmbassadorService,
  GetAllGoodwillAmbassadorsService,
  GetGoodwillAmbassadorByIdService,
  UpdateGoodwillAmbassadorService,
  DeleteGoodwillAmbassadorService,
  GetGoodwillAmbassadorByDesignationService
} from '../service/GoodwillAmbassadorService.js';

// Create Goodwill Ambassador
export const CreateGoodwillAmbassador = async (req, res) => {
  try {
    const result = await CreateGoodwillAmbassadorService(req);
    
    if (result.status) {
      return res.status(201).json(result);
    } else {
      return res.status(400).json(result);
    }
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
    
    if (result.status) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
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
    
    if (result.status) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
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
    
    if (result.status) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }
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
    
    if (result.status) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error deleting Goodwill Ambassador",
      error: error.message
    });
  }
};

// Get Goodwill Ambassadors by Designation
export const GetGoodwillAmbassadorsByDesignation = async (req, res) => {
  try {
    const result = await GetGoodwillAmbassadorByDesignationService(req);
    
    if (result.status) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: `Error retrieving ${req.params.designation}s`,
      error: error.message
    });
  }
}; 