import Sponsor from "../models/SponsorModel.js";
import mongoose from "mongoose";
import { deleteFile } from "../utility/fileUtils.js";
import path from "path";

const ObjectId = mongoose.Types.ObjectId;

// Create Sponsor
export const CreateSponsorService = async (req) => {
  try {
    const reqBody = req.body;
    
    // Create new sponsor
    const newSponsor = new Sponsor(reqBody);
    await newSponsor.save();
    
    return { 
      status: true, 
      message: "Sponsor created successfully.",
      data: newSponsor
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to create sponsor.", 
      details: e.message 
    };
  }
};

// Get All Sponsors
export const GetAllSponsorsService = async (req) => {
  try {
    // Optional query for active only
    const filter = {};
    
    if (req.query.active === 'true') {
      filter.active = true;
    }
    
    // Filter by sponsor type if provided
    if (req.query.type && ['platinum', 'gold', 'silver', 'bronze', 'other'].includes(req.query.type)) {
      filter.sponsorType = req.query.type;
    }
    
    // Get all sponsors with filters
    const sponsors = await Sponsor.find(filter)
      .populate('events', 'title date location');
    
    if (!sponsors || sponsors.length === 0) {
      return { status: false, message: "No sponsors found." };
    }
    
    return {
      status: true,
      data: sponsors,
      message: "Sponsors retrieved successfully.",
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to retrieve sponsors.", 
      details: e.message 
    };
  }
};

// Get Sponsor By ID
export const GetSponsorByIdService = async (req) => {
  try {
    const sponsorId = new ObjectId(req.params.id);
    
    const sponsor = await Sponsor.findById(sponsorId)
      .populate('events', 'title date location');
    
    if (!sponsor) {
      return { status: false, message: "Sponsor not found." };
    }
    
    return {
      status: true,
      data: sponsor,
      message: "Sponsor retrieved successfully.",
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to retrieve sponsor.", 
      details: e.message 
    };
  }
};

// Update Sponsor
export const UpdateSponsorService = async (req) => {
  try {
    const sponsorId = new ObjectId(req.params.id);
    const reqBody = req.body;
    
    // Check if sponsor exists
    const currentSponsor = await Sponsor.findById(sponsorId);
    
    if (!currentSponsor) {
      return { status: false, message: "Sponsor not found." };
    }
    
    // If updating logo, delete the old one
    if (reqBody.logo && currentSponsor.logo && reqBody.logo !== currentSponsor.logo) {
      const fileName = path.basename(currentSponsor.logo);
      await deleteFile(fileName);
    }
    
    // Update sponsor
    const updatedSponsor = await Sponsor.findByIdAndUpdate(
      sponsorId,
      { $set: reqBody },
      { new: true, runValidators: true }
    ).populate('events', 'title date location');
    
    return {
      status: true,
      data: updatedSponsor,
      message: "Sponsor updated successfully.",
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to update sponsor.", 
      details: e.message 
    };
  }
};

// Delete Sponsor
export const DeleteSponsorService = async (req) => {
  try {
    const sponsorId = req.params.id;
    
    if (!ObjectId.isValid(sponsorId)) {
      return { status: false, message: "Invalid sponsor ID." };
    }
    
    // Get sponsor before deletion to access logo
    const sponsor = await Sponsor.findById(sponsorId);
    
    if (!sponsor) {
      return { status: false, message: "Sponsor not found or already deleted." };
    }
    
    // Delete the logo file if it exists
    if (sponsor.logo) {
      const fileName = path.basename(sponsor.logo);
      await deleteFile(fileName);
    }
    
    // Delete the sponsor
    const deletedSponsor = await Sponsor.findByIdAndDelete(sponsorId);
    
    return {
      status: true,
      message: "Sponsor deleted successfully.",
      data: deletedSponsor
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to delete sponsor.", 
      details: e.message 
    };
  }
};

// Toggle Sponsor Active Status
export const ToggleSponsorActiveService = async (req) => {
  try {
    const sponsorId = new ObjectId(req.params.id);
    
    // Get current sponsor
    const sponsor = await Sponsor.findById(sponsorId);
    
    if (!sponsor) {
      return { status: false, message: "Sponsor not found." };
    }
    
    // Toggle the active status
    const updatedSponsor = await Sponsor.findByIdAndUpdate(
      sponsorId,
      { $set: { active: !sponsor.active } },
      { new: true }
    );
    
    return {
      status: true,
      message: `Sponsor ${updatedSponsor.active ? 'activated' : 'deactivated'} successfully.`,
      data: updatedSponsor
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to toggle sponsor status.", 
      details: e.message 
    };
  }
};

// Add Event to Sponsor
export const AddEventToSponsorService = async (req) => {
  try {
    const sponsorId = new ObjectId(req.params.id);
    const { eventId } = req.body;
    
    if (!eventId || !ObjectId.isValid(eventId)) {
      return { status: false, message: "Valid event ID is required." };
    }
    
    // Check if sponsor exists
    const sponsor = await Sponsor.findById(sponsorId);
    
    if (!sponsor) {
      return { status: false, message: "Sponsor not found." };
    }
    
    // Add event to sponsor's events array if not already there
    if (!sponsor.events.includes(eventId)) {
      const updatedSponsor = await Sponsor.findByIdAndUpdate(
        sponsorId,
        { $addToSet: { events: eventId } },
        { new: true }
      ).populate('events', 'title date location');
      
      return {
        status: true,
        message: "Event added to sponsor successfully.",
        data: updatedSponsor
      };
    } else {
      return {
        status: false,
        message: "Event is already associated with this sponsor."
      };
    }
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to add event to sponsor.", 
      details: e.message 
    };
  }
};

// Remove Event from Sponsor
export const RemoveEventFromSponsorService = async (req) => {
  try {
    const sponsorId = new ObjectId(req.params.sponsorId);
    const eventId = new ObjectId(req.params.eventId);
    
    if (!eventId || !ObjectId.isValid(eventId)) {
      return { status: false, message: "Valid event ID is required." };
    }
    
    // Check if sponsor exists
    const sponsor = await Sponsor.findById(sponsorId);
    
    if (!sponsor) {
      return { status: false, message: "Sponsor not found." };
    }
    
    // Remove event from sponsor's events array
    const updatedSponsor = await Sponsor.findByIdAndUpdate(
      sponsorId,
      { $pull: { events: eventId } },
      { new: true }
    ).populate('events', 'title date location');
    
    return {
      status: true,
      message: "Event removed from sponsor successfully.",
      data: updatedSponsor
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to remove event from sponsor.", 
      details: e.message 
    };
  }
};

// Get Sponsors by Type
export const GetSponsorsByTypeService = async (req) => {
  try {
    const { type } = req.params;
    
    if (!type || !['platinum', 'gold', 'silver', 'bronze', 'other'].includes(type)) {
      return { 
        status: false, 
        message: "Invalid sponsor type. Must be one of: platinum, gold, silver, bronze, other." 
      };
    }
    
    const sponsors = await Sponsor.find({ 
      sponsorType: type,
      active: true
    }).populate('events', 'title date location');
    
    if (!sponsors || sponsors.length === 0) {
      return { status: false, message: `No ${type} sponsors found.` };
    }
    
    return {
      status: true,
      data: sponsors,
      message: `${type.charAt(0).toUpperCase() + type.slice(1)} sponsors retrieved successfully.`,
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to retrieve sponsors by type.", 
      details: e.message 
    };
  }
};
