import Hospital from "../models/HospitalModel.js";
import mongoose from "mongoose";

const ObjectId = mongoose.Types.ObjectId;

// Create Hospital
export const CreateHospitalService = async (req) => {
  try {
    const reqBody = req.body;

    // Create new hospital
    const newHospital = new Hospital(reqBody);
    await newHospital.save();
    
    return { 
      status: true, 
      message: "Hospital created successfully.",
      data: newHospital
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to create hospital.", 
      details: e.message 
    };
  }
};

// Get All Hospitals
export const GetAllHospitalsService = async (req) => {
  try {
    // Optional query parameters
    const filter = {};
    
    // Filter by district if provided
    if (req.query.district) {
      filter.district = req.query.district;
    }
    
    // Filter by upazila if provided
    if (req.query.upazila) {
      filter.upazila = req.query.upazila;
    }

    // Search functionality
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      filter.$or = [
        { name: searchRegex },
        { district: searchRegex },
        { upazila: searchRegex },
        { address: searchRegex },
        { specialties: searchRegex }
      ];
    }

    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const totalCount = await Hospital.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / limit);
    
    // Get paginated hospitals with filters
    const hospitals = await Hospital.find(filter)
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit);
    
    if (!hospitals || hospitals.length === 0) {
      return { status: false, message: "No hospitals found." };
    }
    
    return {
      status: true,
      data: hospitals,
      message: "Hospitals retrieved successfully.",
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalCount,
        itemsPerPage: limit
      }
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to retrieve hospitals.", 
      details: e.message 
    };
  }
};

// Get Hospital By ID
export const GetHospitalByIdService = async (req) => {
  try {
    const hospitalId = new ObjectId(req.params.id);
    
    const hospital = await Hospital.findById(hospitalId);
    
    if (!hospital) {
      return { status: false, message: "Hospital not found." };
    }
    
    return {
      status: true,
      data: hospital,
      message: "Hospital retrieved successfully.",
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to retrieve hospital.", 
      details: e.message 
    };
  }
};

// Get Hospitals By District
export const GetHospitalsByDistrictService = async (req) => {
  try {
    const { district } = req.params;
    
    if (!district) {
      return { status: false, message: "District parameter is required." };
    }
    
    const hospitals = await Hospital.find({ district }).sort({ name: 1 });
    
    if (!hospitals || hospitals.length === 0) {
      return { status: false, message: `No hospitals found in ${district} district.` };
    }
    
    return {
      status: true,
      data: hospitals,
      message: `Hospitals in ${district} district retrieved successfully.`,
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to retrieve hospitals by district.", 
      details: e.message 
    };
  }
};

// Get Hospitals By Upazila
export const GetHospitalsByUpazilaService = async (req) => {
  try {
    const { upazila } = req.params;
    
    if (!upazila) {
      return { status: false, message: "Upazila parameter is required." };
    }
    
    const hospitals = await Hospital.find({ upazila }).sort({ name: 1 });
    
    if (!hospitals || hospitals.length === 0) {
      return { status: false, message: `No hospitals found in ${upazila} upazila.` };
    }
    
    return {
      status: true,
      data: hospitals,
      message: `Hospitals in ${upazila} upazila retrieved successfully.`,
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to retrieve hospitals by upazila.", 
      details: e.message 
    };
  }
};

// Update Hospital
export const UpdateHospitalService = async (req) => {
  try {
    const hospitalId = new ObjectId(req.params.id);
    const reqBody = req.body;
    
    // Check if hospital exists
    const hospital = await Hospital.findById(hospitalId);
    
    if (!hospital) {
      return { status: false, message: "Hospital not found." };
    }
    
    // Update hospital
    const updatedHospital = await Hospital.findByIdAndUpdate(
      hospitalId,
      { $set: reqBody },
      { new: true, runValidators: true }
    );
    
    return {
      status: true,
      data: updatedHospital,
      message: "Hospital updated successfully.",
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to update hospital.", 
      details: e.message 
    };
  }
};

// Delete Hospital
export const DeleteHospitalService = async (req) => {
  try {
    const hospitalId = req.params.id;
    
    if (!ObjectId.isValid(hospitalId)) {
      return { status: false, message: "Invalid hospital ID." };
    }
    
    // Check if hospital exists
    const hospital = await Hospital.findById(hospitalId);
    
    if (!hospital) {
      return { status: false, message: "Hospital not found." };
    }
    
    // Delete the hospital
    const deletedHospital = await Hospital.findByIdAndDelete(hospitalId);
    
    return {
      status: true,
      message: "Hospital deleted successfully.",
      data: deletedHospital
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to delete hospital.", 
      details: e.message 
    };
  }
};
