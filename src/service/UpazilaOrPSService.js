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
    const existingUpazilaOrPS = await UpazilaOrPSModel.findOne({ name });
    if (existingUpazilaOrPS) {
      return {
        status: false,
        message: "Upazila/PS with this name already exists."
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

export const GetUpazilaOrPSByDistrict = async (districtId) => {
  try {
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
    const upazilas = await UpazilaOrPSModel.find({ district: districtId })
      .sort({ order: 1 })
      .populate('district', 'name bengaliName');

    return {
      status: true,
      message: "Upazilas/PS retrieved successfully.",
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
