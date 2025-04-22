import {
  CreateUpazilaOrPSService,
  GetUpazilaOrPSByDistrict
} from '../service/UpazilaOrPSService.js';

// Create Upazila or Police Station
export const CreateUpazilaOrPS = async (req, res) => {
  try {
    const result = await CreateUpazilaOrPSService(req.body);
    return res.status(result.status ? 200 : 400).json(result);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error creating upazila/PS",
      error: error.message
    });
  }
};

// Get Upazilas or Police Stations by District ID
export const GetUpazilasOrPSByDistrict = async (req, res) => {
  try {
    const { districtId } = req.params;
    const result = await GetUpazilaOrPSByDistrict(districtId);
    return res.status(result.status ? 200 : 400).json(result);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error retrieving upazilas/PS",
      error: error.message
    });
  }
};
