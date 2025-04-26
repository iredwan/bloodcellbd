import UpazilaOrPSModel from '../models/UpazilaOrPSModel.js';
import DistrictModel from '../models/DistrictModel.js';

export const CreateUpazilaOrPSService = async (data) => {
  try {
    const { name, bengaliName, district, order } = data;

    // Validate required fields
    if (!name || !bengaliName || !district) {
      return {
        status: false,
        message: "Upazila/PS name, Bengali name, and district are required."
      };
    }

    // Check if district exists
    const existingDistrict = await DistrictModel.findById(district);
    if (!existingDistrict) {
      return {
        status: false,
        message: "District not found."
      };
    }

    // Check if upazila/PS already exists
    const existingUpazilaOrPS = await UpazilaOrPSModel.findOne({ name, district });
    if (existingUpazilaOrPS) {
      return {
        status: false,
        message: "Upazila/PS with this name already exists in the selected district."
      };
    }

    // Create new upazila/PS
    const newUpazilaOrPS = await UpazilaOrPSModel.create({
      name,
      bengaliName,
      district,
      order: order || 0
    });

    return {
      status: true,
      message: "Upazila/PS created successfully.",
      data: newUpazilaOrPS
    };
  } catch (e) {
    return {
      status: false,
      message: "Failed to create Upazila/PS.",
      details: e.message
    };
  }
};

export const GetUpazilaOrPSByDistrict = async (req  ) => {
  try {
    const { districtId } = req.params;
    // Validate district ID
    if (!districtId) {
      return {
        status: false,
        message: "District ID is required."
      };
    }

    // Check if district exists
    const existingDistrict = await DistrictModel.findById(districtId);
    if (!existingDistrict) {
      return {
        status: false,
        message: "District not found."
      };
    }


    // Get all upazilas/PS for the district
    const upazilas = await UpazilaOrPSModel.find({ district: districtId }, 
      { order: 0, createdAt: 0, updatedAt: 0 })
      .sort({ order: 1 });
    
    const count = await UpazilaOrPSModel.countDocuments({ district: districtId });

    return {
      status: true,
      message: "Upazilas/PS retrieved successfully.",
      total: count,
      data: upazilas
    };
  } catch (e) {
    return {
      status: false,
      message: "Failed to retrieve Upazilas/PS.",
      details: e.message
    };
  }
};
