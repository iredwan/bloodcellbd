import {
  CreateWantToDonateBloodService,
  GetAllWantToDonateBloodService,
  GetWantToDonateBloodByIdService,
  UpdateWantToDonateBloodService,
  DeleteWantToDonateBloodService,
  UpdateBloodCollectedByService,
  GetWantToDonateBloodByUserIdService
} from "../service/WantToDonateBloodService.js";

// Create blood donation request
export const CreateWantToDonateBlood = async (req, res) => {
  try {
    const result = await CreateWantToDonateBloodService(req);
    
    if (result.status) {
      return res.status(201).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error creating blood donation request",
      error: error.message
    });
  }
};

// Get all blood donation requests
export const GetAllWantToDonateBlood = async (req, res) => {
  try {
    const result = await GetAllWantToDonateBloodService();
    
    if (result.status) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error retrieving blood donation requests",
      error: error.message
    });
  }
};

// Get blood donation request by ID
export const GetWantToDonateBloodById = async (req, res) => {
  try {
    const result = await GetWantToDonateBloodByIdService(req);
    
    if (result.status) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error retrieving blood donation request",
      error: error.message
    });
  }
};

// Update blood donation request details
export const UpdateWantToDonateBlood = async (req, res) => {
  try {
    const result = await UpdateWantToDonateBloodService(req);
    
    if (result.status) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error updating blood donation request",
      error: error.message
    });
  }
};

// Get blood donation requests by user ID
export const GetWantToDonateBloodByUserId = async (req, res) => {
  try {
    const result = await GetWantToDonateBloodByUserIdService(req);  

    if (result.status) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
  } catch (error) { 
    return res.status(500).json({
      status: false,
      message: "Error retrieving blood donation requests by user ID",
      error: error.message
    });
  }
};


// Update blood collected by
export const UpdateBloodCollectedBy = async (req, res) => {
  try {
    const result = await UpdateBloodCollectedByService(req);  

    if (result.status) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
  } catch (error) { 
    return res.status(500).json({
      status: false,
      message: "Error updating blood collected by",
      error: error.message
    });
  }
};


// Delete blood donation request
export const DeleteWantToDonateBlood = async (req, res) => {
  try {
    const result = await DeleteWantToDonateBloodService(req);
    
    if (result.status) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error deleting blood donation request",
      error: error.message
    });
  }
}; 