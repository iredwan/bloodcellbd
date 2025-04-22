import {
  CreateHospitalService,
  GetAllHospitalsService,
  GetHospitalByIdService,
  GetHospitalsByDistrictService,
  GetHospitalsByUpazilaService,
  UpdateHospitalService,
  DeleteHospitalService
} from "../service/HospitalService.js";

// Create Hospital
export const CreateHospital = async (req, res) => {
  try {
    const result = await CreateHospitalService(req);
    
    if (result.status) {
      return res.status(201).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (e) {
    return res.status(500).json({ status: false, message: "An error occurred.", details: e.message });
  }
};

// Get All Hospitals
export const GetAllHospitals = async (req, res) => {
  try {
    const result = await GetAllHospitalsService(req);
    
    if (result.status) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
  } catch (e) {
    return res.status(500).json({ status: false, message: "An error occurred.", details: e.message });
  }
};

// Get Hospital By ID
export const GetHospitalById = async (req, res) => {
  try {
    const result = await GetHospitalByIdService(req);
    
    if (result.status) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
  } catch (e) {
    return res.status(500).json({ status: false, message: "An error occurred.", details: e.message });
  }
};

// Get Hospitals By District
export const GetHospitalsByDistrict = async (req, res) => {
  try {
    const result = await GetHospitalsByDistrictService(req);
    
    if (result.status) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
  } catch (e) {
    return res.status(500).json({ status: false, message: "An error occurred.", details: e.message });
  }
};

// Get Hospitals By Upazila
export const GetHospitalsByUpazila = async (req, res) => {
  try {
    const result = await GetHospitalsByUpazilaService(req);
    
    if (result.status) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
  } catch (e) {
    return res.status(500).json({ status: false, message: "An error occurred.", details: e.message });
  }
};

// Update Hospital
export const UpdateHospital = async (req, res) => {
  try {
    const result = await UpdateHospitalService(req);
    
    if (result.status) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
  } catch (e) {
    return res.status(500).json({ status: false, message: "An error occurred.", details: e.message });
  }
};

// Delete Hospital
export const DeleteHospital = async (req, res) => {
  try {
    const result = await DeleteHospitalService(req);
    
    if (result.status) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
  } catch (e) {
    return res.status(500).json({ status: false, message: "An error occurred.", details: e.message });
  }
}; 