import DistrictModel from "../models/DistrictModel.js";

export const CreateDistrictService = async (body) => {
  try {
    const { name, bengaliName, order } = body;

    // Check if required fields are provided
    if (!name || !bengaliName) {
      return {
        status: false,
        message: "District name and Bengali name are required."
      };
    }

    // Check if district already exists
    const existingDistrict = await DistrictModel.findOne({ name });
    if (existingDistrict) {
      return {
        status: false,
        message: "District with this name already exists."
      };
    }

    // Create new district
    const newDistrict = await DistrictModel.create({
      name,
      bengaliName,
      order: order || 0
    });

    return {
      status: true,
      message: "District created successfully.",
      data: newDistrict
    };
  } catch (e) {
    return {
      status: false,
      message: "Failed to create district.",
      details: e.message
    };
  }
};

export const GetAllDistrictsService = async () => {
  try {
    const districts = await DistrictModel.find({}, { order: 0, createdAt: 0, updatedAt: 0 }).sort({ order: 1 });
    return {
      status: true,
      message: "All districts retrieved successfully.",
      data: districts
    };
  } catch (e) {
    return {
      status: false,
      message: "Failed to retrieve districts.",
      details: e.message
    };
  }
};