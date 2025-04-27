import DivisionModel from "../models/DivisionModel.js";

// Get All Divisions Service
export const GetAllDivisionsService = async () => {
  try {
    const divisions = await DivisionModel.find().sort({ order: 1 });
    
    if (!divisions || divisions.length === 0) {
      return { status: false, message: "No divisions found" };
    }
    
    return { 
      status: true, 
      message: "Divisions retrieved successfully", 
      data: divisions
    };
  } catch (error) {
    return { status: false, message: "Error retrieving divisions", error: error.message };
  }
};
