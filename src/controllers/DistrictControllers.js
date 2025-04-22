import {
  CreateDistrictService,
  GetAllDistrictsService,
} from '../service/DistrictService.js';

// Create District
export const CreateDistrict = async (req, res) => {
  try {
    const result = await CreateDistrictService(req.body);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error creating district",
      error: error.message
    });
  }
};

// Get All Districts
export const GetAllDistricts = async (req, res) => {
  try {
    const result = await GetAllDistrictsService();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error retrieving districts",
      error: error.message
    });
  }
};
