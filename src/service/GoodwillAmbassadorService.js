import GoodwillAmbassador from "../models/GoodwillAmbassadorModel.js";
import mongoose from "mongoose";
import { deleteFile } from "../utility/fileUtils.js";
import path from "path";

const ObjectId = mongoose.Types.ObjectId;

// Create Goodwill Ambassador
export const CreateGoodwillAmbassadorService = async (req) => {
  try {
    const reqBody = req.body;
    
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
    // Optional query for active only
    const filter = {};
    
    if (req.query.active === 'true') {
      filter.active = true;
    }
    
    // Filter by featured if provided
    if (req.query.featured === 'true') {
      filter.featured = true;
    }
    
    // Get all goodwill ambassadors with filters
    const ambassadors = await GoodwillAmbassador.find(filter)
      .populate('events', 'title date location');
    
    if (!ambassadors || ambassadors.length === 0) {
      return { status: false, message: "No Goodwill Ambassadors found." };
    }
    
    return {
      status: true,
      data: ambassadors,
      message: "Goodwill Ambassadors retrieved successfully.",
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
    const ambassadorId = new ObjectId(req.params.id);
    
    const ambassador = await GoodwillAmbassador.findById(ambassadorId)
      .populate('events', 'title date location');
    
    if (!ambassador) {
      return { status: false, message: "Goodwill Ambassador not found." };
    }
    
    return {
      status: true,
      data: ambassador,
      message: "Goodwill Ambassador retrieved successfully.",
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
    const ambassadorId = new ObjectId(req.params.id);
    const reqBody = req.body;
    
    // Check if ambassador exists
    const currentAmbassador = await GoodwillAmbassador.findById(ambassadorId);
    
    if (!currentAmbassador) {
      return { status: false, message: "Goodwill Ambassador not found." };
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
    ).populate('events', 'title date location');
    
    return {
      status: true,
      data: updatedAmbassador,
      message: "Goodwill Ambassador updated successfully.",
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
      return { status: false, message: "Invalid Goodwill Ambassador ID." };
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

// Toggle Goodwill Ambassador Active Status
export const ToggleGoodwillAmbassadorActiveService = async (req) => {
  try {
    const ambassadorId = new ObjectId(req.params.id);
    
    // Get current ambassador
    const ambassador = await GoodwillAmbassador.findById(ambassadorId);
    
    if (!ambassador) {
      return { status: false, message: "Goodwill Ambassador not found." };
    }
    
    // Toggle the active status
    const updatedAmbassador = await GoodwillAmbassador.findByIdAndUpdate(
      ambassadorId,
      { $set: { active: !ambassador.active } },
      { new: true }
    );
    
    return {
      status: true,
      message: `Goodwill Ambassador ${updatedAmbassador.active ? 'activated' : 'deactivated'} successfully.`,
      data: updatedAmbassador
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to toggle Goodwill Ambassador status.", 
      details: e.message 
    };
  }
};

// Toggle Goodwill Ambassador Featured Status
export const ToggleGoodwillAmbassadorFeaturedService = async (req) => {
  try {
    const ambassadorId = new ObjectId(req.params.id);
    
    // Get current ambassador
    const ambassador = await GoodwillAmbassador.findById(ambassadorId);
    
    if (!ambassador) {
      return { status: false, message: "Goodwill Ambassador not found." };
    }
    
    // Toggle the featured status
    const updatedAmbassador = await GoodwillAmbassador.findByIdAndUpdate(
      ambassadorId,
      { $set: { featured: !ambassador.featured } },
      { new: true }
    );
    
    return {
      status: true,
      message: `Goodwill Ambassador ${updatedAmbassador.featured ? 'featured' : 'unfeatured'} successfully.`,
      data: updatedAmbassador
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to toggle Goodwill Ambassador featured status.", 
      details: e.message 
    };
  }
};

// Add Event to Goodwill Ambassador
export const AddEventToGoodwillAmbassadorService = async (req) => {
  try {
    const ambassadorId = new ObjectId(req.params.ambassadorId);
    const eventId = new ObjectId(req.params.eventId);
    
    if (!eventId || !ObjectId.isValid(eventId)) {
      return { status: false, message: "Valid event ID is required." };
    }
    
    // Check if ambassador exists
    const ambassador = await GoodwillAmbassador.findById(ambassadorId);
    
    if (!ambassador) {
      return { status: false, message: "Goodwill Ambassador not found." };
    }
    
    // Add event to ambassador's events array if not already there
    if (!ambassador.events.includes(eventId)) {
      const updatedAmbassador = await GoodwillAmbassador.findByIdAndUpdate(
        ambassadorId,
        { $addToSet: { events: eventId } },
        { new: true }
      ).populate('events', 'title date location');
      
      return {
        status: true,
        message: "Event added to Goodwill Ambassador successfully.",
        data: updatedAmbassador
      };
    } else {
      return {
        status: false,
        message: "Event is already associated with this Goodwill Ambassador."
      };
    }
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to add event to Goodwill Ambassador.", 
      details: e.message 
    };
  }
};

// Remove Event from Goodwill Ambassador
export const RemoveEventFromGoodwillAmbassadorService = async (req) => {
  try {
    const ambassadorId = new ObjectId(req.params.ambassadorId);
    const eventId = new ObjectId(req.params.eventId);
    
    if (!eventId || !ObjectId.isValid(eventId)) {
      return { status: false, message: "Valid event ID is required." };
    }
    
    // Check if ambassador exists
    const ambassador = await GoodwillAmbassador.findById(ambassadorId);
    
    if (!ambassador) {
      return { status: false, message: "Goodwill Ambassador not found." };
    }
    
    // Remove event from ambassador's events array
    const updatedAmbassador = await GoodwillAmbassador.findByIdAndUpdate(
      ambassadorId,
      { $pull: { events: eventId } },
      { new: true }
    ).populate('events', 'title date location');
    
    return {
      status: true,
      message: "Event removed from Goodwill Ambassador successfully.",
      data: updatedAmbassador
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to remove event from Goodwill Ambassador.", 
      details: e.message 
    };
  }
};

// Get Goodwill Ambassadors by Designation
export const GetGoodwillAmbassadorByDesignationService = async (req) => {
  try {
    const { designation } = req.params;
    
    if (!designation) {
      return { status: false, message: "Designation parameter is required." };
    }
    
    // Find all ambassadors with the specified designation
    const ambassadors = await GoodwillAmbassador.find({ 
      designation: designation,
      active: true 
    }).sort({ createdAt: -1 });
    
    if (!ambassadors || ambassadors.length === 0) {
      return { 
        status: false, 
        message: `No Goodwill Ambassadors found with designation: ${designation}.` 
      };
    }
    
    return {
      status: true,
      message: `Goodwill Ambassadors with designation '${designation}' retrieved successfully.`,
      data: ambassadors
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to retrieve Goodwill Ambassadors by designation.", 
      details: e.message 
    };
  }
};
