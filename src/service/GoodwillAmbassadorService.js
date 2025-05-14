import GoodwillAmbassador from "../models/GoodwillAmbassadorModel.js";
import mongoose from "mongoose";
import { deleteFile } from "../utility/fileUtils.js";
import path from "path";

const ObjectId = mongoose.Types.ObjectId;

// Create Goodwill Ambassador
export const CreateGoodwillAmbassadorService = async (req) => {
  try {
    const reqBody = req.body;
    
    // Validate required fields
    if (!reqBody.name || !reqBody.designation || !reqBody.profileImage) {
      return {
        status: false,
        message: "Name, designation, and profile image are required fields."
      };
    }
    
    // Set creator information
    const userId = req.headers.user_id || req.cookies.user_id;
    if (userId) {
      reqBody.createdBy = userId;
    }


    // Create new goodwill ambassador
    const newAmbassador = new GoodwillAmbassador(reqBody);
    await newAmbassador.save();
    return { 
      status: true, 
      message: "Goodwill Ambassador created successfully.",
      data: newAmbassador
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to create Goodwill Ambassador.", 
      details: e.message 
    };
  }
};

// Get All Goodwill Ambassadors
export const GetAllGoodwillAmbassadorsService = async (req) => {
  try {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Build filter object based on query parameters
    const filter = {};
    
    // Filter by active status if provided
    if (req.query.active === 'true' || req.query.active === 'false') {
      filter.active = req.query.active === 'true';
    }
    
    // Filter by designation if provided
    if (req.query.designation && ['Goodwill Ambassador', 'Honorable Member'].includes(req.query.designation)) {
      filter.designation = req.query.designation;
    }
    
    // Text search
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { position: { $regex: req.query.search, $options: 'i' } },
        { organization: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    // Count total for pagination info
    const total = await GoodwillAmbassador.countDocuments(filter);
    
    // Get all goodwill ambassadors with filters
    const ambassadors = await GoodwillAmbassador.find(filter)
      .sort({ order: 1 })
      .skip(skip)
      .limit(limit)
      .select('-events'); // Exclude events array for performance
    
    if (!ambassadors || ambassadors.length === 0) {
      return { 
        status: false, 
        message: "No Goodwill Ambassadors found." 
      };
    }
    
    return {
      status: true,
      data: {
        ambassadors,
        pagination: {
          totalAmbassadors: total,
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          ambassadorsPerPage: limit
        }
      },
      message: "Goodwill Ambassadors retrieved successfully."
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to retrieve Goodwill Ambassadors.", 
      details: e.message 
    };
  }
};

// Get Goodwill Ambassador By ID
export const GetGoodwillAmbassadorByIdService = async (req) => {
  try {
    const ambassadorId = req.params.id;
    
    if (!ObjectId.isValid(ambassadorId)) {
      return { status: false, message: "Invalid Goodwill Ambassador ID format." };
    }
    
    const ambassador = await GoodwillAmbassador.findById(ambassadorId)
      .populate({
        path: 'events',
        select: 'title date location image status'
      })
      .populate('createdBy', 'name role')
      .populate('updatedBy', 'name role');
    
    if (!ambassador) {
      return { status: false, message: "Goodwill Ambassador not found." };
    }
    
    return {
      status: true,
      data: ambassador,
      message: "Goodwill Ambassador retrieved successfully."
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to retrieve Goodwill Ambassador.", 
      details: e.message 
    };
  }
};

// Update Goodwill Ambassador
export const UpdateGoodwillAmbassadorService = async (req) => {
  try {
    const ambassadorId = req.params.id;
    const reqBody = req.body;
    
    if (!ObjectId.isValid(ambassadorId)) {
      return { status: false, message: "Invalid Goodwill Ambassador ID format." };
    }
    
    // Check if ambassador exists
    const currentAmbassador = await GoodwillAmbassador.findById(ambassadorId);
    
    if (!currentAmbassador) {
      return { status: false, message: "Goodwill Ambassador not found." };
    }
    
    // Set updater information
    const userId = req.headers.user_id || req.cookies.user_id;
    if (userId) {
      reqBody.updatedBy = userId;
    }
    
    // If updating profile image, delete the old one
    if (reqBody.profileImage && currentAmbassador.profileImage && reqBody.profileImage !== currentAmbassador.profileImage) {
      const fileName = path.basename(currentAmbassador.profileImage);
      await deleteFile(fileName);
    }
    
    // Update ambassador
    const updatedAmbassador = await GoodwillAmbassador.findByIdAndUpdate(
      ambassadorId,
      { $set: reqBody },
      { new: true, runValidators: true }
    )
      .populate({
        path: 'events',
        select: 'title date location'
      })
      .populate('updatedBy', 'name role');
    
    return {
      status: true,
      data: updatedAmbassador,
      message: "Goodwill Ambassador updated successfully."
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to update Goodwill Ambassador.", 
      details: e.message 
    };
  }
};

// Delete Goodwill Ambassador
export const DeleteGoodwillAmbassadorService = async (req) => {
  try {
    const ambassadorId = req.params.id;
    
    if (!ObjectId.isValid(ambassadorId)) {
      return { status: false, message: "Invalid Goodwill Ambassador ID format." };
    }
    
    // Get ambassador before deletion to access profile image
    const ambassador = await GoodwillAmbassador.findById(ambassadorId);
    
    if (!ambassador) {
      return { status: false, message: "Goodwill Ambassador not found or already deleted." };
    }
    
    // Delete the profile image file if it exists
    if (ambassador.profileImage) {
      const fileName = path.basename(ambassador.profileImage);
      await deleteFile(fileName);
    }
    
    // Delete the ambassador
    const deletedAmbassador = await GoodwillAmbassador.findByIdAndDelete(ambassadorId);
    
    return {
      status: true,
      message: "Goodwill Ambassador deleted successfully.",
      data: deletedAmbassador
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to delete Goodwill Ambassador.", 
      details: e.message 
    };
  }
};

// Get Goodwill Ambassadors By Designation
export const GetGoodwillAmbassadorByDesignationService = async (req) => {
  try {
    const designation = req.params.designation;
    
    if (!designation || !['Goodwill Ambassador', 'Honorable Member'].includes(designation)) {
      return { 
        status: false, 
        message: "Invalid designation. Must be 'Goodwill Ambassador' or 'Honorable Member'." 
      };
    }
    
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Base filter: active ambassadors with specified designation
    const filter = { 
      designation: designation,
      active: true 
    };
    
    // Count total for pagination
    const total = await GoodwillAmbassador.countDocuments(filter);
    
    // Get ambassadors by designation
    const ambassadors = await GoodwillAmbassador.find(filter)
      .sort({ order: 1 })
      .skip(skip)
      .limit(limit)
      .select('-events');
    
    if (!ambassadors || ambassadors.length === 0) {
      return { 
        status: false, 
        message: `No ${designation}s found.` 
      };
    }
    
    return {
      status: true,
      data: {
        ambassadors,
        pagination: {
          total,
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          itemsPerPage: limit
        }
      },
      message: `${designation}s retrieved successfully.`
    };
  } catch (e) {
    return { 
      status: false, 
      message: `Failed to retrieve ${req.params.designation}s.`, 
      details: e.message 
    };
  }
};
