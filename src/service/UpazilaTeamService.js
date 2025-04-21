import UpazilaTeam from "../models/UpazilaTeamModel.js";
import mongoose from "mongoose";

const ObjectId = mongoose.Types.ObjectId;

// Create Upazila Team Member
export const CreateUpazilaTeamService = async (req) => {
  try {
    const reqBody = req.body;
    
    // Create new upazila team member
    const newMember = new UpazilaTeam(reqBody);
    await newMember.save();
    
    return { 
      status: true, 
      message: "Upazila team member created successfully.",
      data: newMember
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to create upazila team member.", 
      details: e.message 
    };
  }
};

// Get All Upazila Team Members
export const GetAllUpazilaTeamService = async (req) => {
  try {
    // Optional query parameters
    const filter = {};
    
    if (req.query.active === 'true') {
      filter.active = true;
    }
    
    if (req.query.featured === 'true') {
      filter.featured = true;
    }
    
    // Filter by district if provided
    if (req.query.district) {
      filter.district = req.query.district;
    }
    
    // Filter by upazila if provided
    if (req.query.upazila) {
      filter.upazila = req.query.upazila;
    }
    
    // Get all upazila team members with filters
    const members = await UpazilaTeam.find(filter)
      .populate('userId', 'name email profilePicture')
      .sort({ order: 1 });
    
    if (!members || members.length === 0) {
      return { status: false, message: "No upazila team members found." };
    }
    
    return {
      status: true,
      data: members,
      message: "Upazila team members retrieved successfully.",
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to retrieve upazila team members.", 
      details: e.message 
    };
  }
};

// Get Upazila Team Member By ID
export const GetUpazilaTeamByIdService = async (req) => {
  try {
    const memberId = new ObjectId(req.params.id);
    
    const member = await UpazilaTeam.findById(memberId)
      .populate('userId', 'name email profilePicture');
    
    if (!member) {
      return { status: false, message: "Upazila team member not found." };
    }
    
    return {
      status: true,
      data: member,
      message: "Upazila team member retrieved successfully.",
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to retrieve upazila team member.", 
      details: e.message 
    };
  }
};

// Get Upazila Team Members By District
export const GetUpazilaTeamByDistrictService = async (req) => {
  try {
    const { district } = req.params;
    
    if (!district) {
      return { status: false, message: "District parameter is required." };
    }
    
    const filter = { district };
    
    // Add active filter if specified
    if (req.query.active === 'true') {
      filter.active = true;
    }
    
    const members = await UpazilaTeam.find(filter)
      .populate('userId', 'name email profilePicture')
      .sort({ order: 1 });
    
    if (!members || members.length === 0) {
      return { status: false, message: `No upazila team members found for ${district} district.` };
    }
    
    return {
      status: true,
      data: members,
      message: `Upazila team members for ${district} district retrieved successfully.`,
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to retrieve upazila team members by district.", 
      details: e.message 
    };
  }
};

// Get Upazila Team Members By Upazila
export const GetUpazilaTeamByUpazilaService = async (req) => {
  try {
    const { upazila } = req.params;
    
    if (!upazila) {
      return { status: false, message: "Upazila parameter is required." };
    }
    
    const filter = { upazila };
    
    // Add active filter if specified
    if (req.query.active === 'true') {
      filter.active = true;
    }
    
    const members = await UpazilaTeam.find(filter)
      .populate('userId', 'name email profilePicture')
      .sort({ order: 1 });
    
    if (!members || members.length === 0) {
      return { status: false, message: `No upazila team members found for ${upazila} upazila.` };
    }
    
    return {
      status: true,
      data: members,
      message: `Upazila team members for ${upazila} upazila retrieved successfully.`,
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to retrieve upazila team members by upazila.", 
      details: e.message 
    };
  }
};

// Update Upazila Team Member
export const UpdateUpazilaTeamService = async (req) => {
  try {
    const memberId = new ObjectId(req.params.id);
    const reqBody = req.body;
    
    // Check if upazila team member exists
    const currentMember = await UpazilaTeam.findById(memberId);
    
    if (!currentMember) {
      return { status: false, message: "Upazila team member not found." };
    }
    
    // Update upazila team member
    const updatedMember = await UpazilaTeam.findByIdAndUpdate(
      memberId,
      { $set: reqBody },
      { new: true, runValidators: true }
    ).populate('userId', 'name email profilePicture');
    
    return {
      status: true,
      data: updatedMember,
      message: "Upazila team member updated successfully.",
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to update upazila team member.", 
      details: e.message 
    };
  }
};

// Delete Upazila Team Member
export const DeleteUpazilaTeamService = async (req) => {
  try {
    const memberId = req.params.id;
    
    if (!ObjectId.isValid(memberId)) {
      return { status: false, message: "Invalid upazila team member ID." };
    }
    
    // Check if member exists
    const member = await UpazilaTeam.findById(memberId);
    
    if (!member) {
      return { status: false, message: "Upazila team member not found or already deleted." };
    }
    
    // Delete the upazila team member
    const deletedMember = await UpazilaTeam.findByIdAndDelete(memberId);
    
    return {
      status: true,
      message: "Upazila team member deleted successfully.",
      data: deletedMember
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to delete upazila team member.", 
      details: e.message 
    };
  }
};

// Toggle Upazila Team Member Active Status
export const ToggleUpazilaTeamActiveService = async (req) => {
  try {
    const memberId = new ObjectId(req.params.id);
    
    // Get current upazila team member
    const member = await UpazilaTeam.findById(memberId);
    
    if (!member) {
      return { status: false, message: "Upazila team member not found." };
    }
    
    // Toggle the active status
    const updatedMember = await UpazilaTeam.findByIdAndUpdate(
      memberId,
      { $set: { active: !member.active } },
      { new: true }
    ).populate('userId', 'name email profilePicture');
    
    return {
      status: true,
      message: `Upazila team member ${updatedMember.active ? 'activated' : 'deactivated'} successfully.`,
      data: updatedMember
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to toggle upazila team member status.", 
      details: e.message 
    };
  }
};

// Toggle Upazila Team Member Featured Status
export const ToggleUpazilaTeamFeaturedService = async (req) => {
  try {
    const memberId = new ObjectId(req.params.id);
    
    // Get current upazila team member
    const member = await UpazilaTeam.findById(memberId);
    
    if (!member) {
      return { status: false, message: "Upazila team member not found." };
    }
    
    // Toggle the featured status
    const updatedMember = await UpazilaTeam.findByIdAndUpdate(
      memberId,
      { $set: { featured: !member.featured } },
      { new: true }
    ).populate('userId', 'name email profilePicture');
    
    return {
      status: true,
      message: `Upazila team member ${updatedMember.featured ? 'featured' : 'unfeatured'} successfully.`,
      data: updatedMember
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to toggle upazila team member featured status.", 
      details: e.message 
    };
  }
};

// Update Upazila Team Member Order
export const UpdateUpazilaTeamOrderService = async (req) => {
  try {
    const memberId = new ObjectId(req.params.id);
    const { order } = req.body;
    
    if (typeof order !== 'number') {
      return { status: false, message: "Order must be a number." };
    }
    
    // Get current upazila team member
    const member = await UpazilaTeam.findById(memberId);
    
    if (!member) {
      return { status: false, message: "Upazila team member not found." };
    }
    
    // Update the order
    const updatedMember = await UpazilaTeam.findByIdAndUpdate(
      memberId,
      { $set: { order } },
      { new: true }
    ).populate('userId', 'name email profilePicture');
    
    return {
      status: true,
      message: "Upazila team member order updated successfully.",
      data: updatedMember
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to update upazila team member order.", 
      details: e.message 
    };
  }
}; 