import DivisionalTeam from "../models/DivisionalTeamModel.js";
import mongoose from "mongoose";
import { deleteFile } from "../utility/fileUtils.js";
import path from "path";
import UserModel from "../models/UserModel.js";
const ObjectId = mongoose.Types.ObjectId;

// Create Divisional Team Member
export const CreateDivisionalTeamService = async (req) => {
  try {
    const reqBody = req.body;
    const userId = reqBody.userId;

    const user = await UserModel.findById(userId);
    if (!user) {
      return { status: false, message: "User not found." };
    }

    const divisionalTeam = await DivisionalTeam.findOne({ userId });
    if (divisionalTeam) {
      return { status: false, message: "Divisional team member already exists." };
    }
    
    // Create new divisional team member
    const newMember = new DivisionalTeam(reqBody);
    await newMember.save();
    
    return { 
      status: true, 
      message: "Divisional team member created successfully.",
      data: newMember
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to create divisional team member.", 
      details: e.message 
    };
  }
};

// Get All Divisional Team Members
export const GetAllDivisionalTeamService = async (req) => {
  try {
    // Optional query parameters
    const filter = {};
    
    if (req.query.active === 'true') {
      filter.active = true;
    }
    
    if (req.query.featured === 'true') {
      filter.featured = true;
    }
    
    // Filter by division if provided
    if (req.query.division) {
      filter.division = req.query.division;
    }
    
    // Get all divisional team members with filters
    const members = await DivisionalTeam.find(filter)
      .populate('userId', 'name email avatar district upazila phone')
      .sort({ order: 1 });
    
    if (!members || members.length === 0) {
      return { status: false, message: "No divisional team members found." };
    }
    
    return {
      status: true,
      data: members,
      message: "Divisional team members retrieved successfully.",
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to retrieve divisional team members.", 
      details: e.message 
    };
  }
};

// Get Divisional Team Member By ID
export const GetDivisionalTeamByIdService = async (req) => {
  try {
    const memberId = new ObjectId(req.params.id);
    
    const member = await DivisionalTeam.findById(memberId)
      .populate('userId', 'name email avatar district upazila phone');
    
    if (!member) {
      return { status: false, message: "Divisional team member not found." };
    }
    
    return {
      status: true,
      data: member,
      message: "Divisional team member retrieved successfully.",
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to retrieve divisional team member.", 
      details: e.message 
    };
  }
};

// Get Divisional Team Members By Division
export const GetDivisionalTeamByDivisionService = async (req) => {
  try {
    const { division } = req.params;
    
    if (!division) {
      return { status: false, message: "Division parameter is required." };
    }
    
    const filter = { division };
    
    // Add active filter if specified
    if (req.query.active === 'true') {
      filter.active = true;
    }
    
    const members = await DivisionalTeam.find(filter)
      .populate('userId', 'name email avatar district upazila phone')
      .sort({ order: 1 });
    
    if (!members || members.length === 0) {
      return { status: false, message: `No divisional team members found for ${division} division.` };
    }
    
    return {
      status: true,
      data: members,
      message: `Divisional team members for ${division} division retrieved successfully.`,
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to retrieve divisional team members by division.", 
      details: e.message 
    };
  }
};

// Update Divisional Team Member
export const UpdateDivisionalTeamService = async (req) => {
  try {
    const memberId = new ObjectId(req.params.id);
    const reqBody = req.body;
    
    // Check if divisional team member exists
    const currentMember = await DivisionalTeam.findById(memberId)
      .populate('userId', 'name email avatar district upazila phone');
    
    if (!currentMember) {
      return { status: false, message: "Divisional team member not found." };
    }
    
    // If updating image, delete the old one
    if (reqBody.image && currentMember.image && reqBody.image !== currentMember.image) {
      const fileName = path.basename(currentMember.image);
      await deleteFile(fileName);
    }
    
    // Update divisional team member
    const updatedMember = await DivisionalTeam.findByIdAndUpdate(
      memberId,
      { $set: reqBody },
      { new: true, runValidators: true }
    );
    
    return {
      status: true,
      data: updatedMember,
      message: "Divisional team member updated successfully.",
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to update divisional team member.", 
      details: e.message 
    };
  }
};

// Delete Divisional Team Member
export const DeleteDivisionalTeamService = async (req) => {
  try {
    const memberId = req.params.id;
    
    if (!ObjectId.isValid(memberId)) {
      return { status: false, message: "Invalid divisional team member ID." };
    }
    
    // Get member before deletion to access image
    const member = await DivisionalTeam.findById(memberId)
      .populate('userId', 'name email avatar district upazila phone');
    
    if (!member) {
      return { status: false, message: "Divisional team member not found or already deleted." };
    }
    
    // Delete the image file if it exists
    if (member.image) {
      const fileName = path.basename(member.image);
      await deleteFile(fileName);
    }
    
    // Delete the divisional team member
    const deletedMember = await DivisionalTeam.findByIdAndDelete(memberId);
    
    return {
      status: true,
      message: "Divisional team member deleted successfully.",
      data: deletedMember
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to delete divisional team member.", 
      details: e.message 
    };
  }
};

// Toggle Divisional Team Member Active Status
export const ToggleDivisionalTeamActiveService = async (req) => {
  try {
    const memberId = new ObjectId(req.params.id);
    
    // Get current divisional team member
      const member = await DivisionalTeam.findById(memberId)
      .populate('userId', 'name email avatar district upazila phone');
    
    if (!member) {
      return { status: false, message: "Divisional team member not found." };
    }
    
    // Toggle the active status
    const updatedMember = await DivisionalTeam.findByIdAndUpdate(
      memberId,
      { $set: { active: !member.active } },
      { new: true }
    );
    
    return {
      status: true,
      message: `Divisional team member ${updatedMember.active ? 'activated' : 'deactivated'} successfully.`,
      data: updatedMember
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to toggle divisional team member status.", 
      details: e.message 
    };
  }
};

// Toggle Divisional Team Member Featured Status
export const ToggleDivisionalTeamFeaturedService = async (req) => {
  try {
    const memberId = new ObjectId(req.params.id);
    
    // Get current divisional team member
      const member = await DivisionalTeam.findById(memberId)
      .populate('userId', 'name email avatar district upazila phone');
    
    if (!member) {
      return { status: false, message: "Divisional team member not found." };
    }
    
    // Toggle the featured status
    const updatedMember = await DivisionalTeam.findByIdAndUpdate(
      memberId,
      { $set: { featured: !member.featured } },
      { new: true }
    );
    
    return {
      status: true,
      message: `Divisional team member ${updatedMember.featured ? 'featured' : 'unfeatured'} successfully.`,
      data: updatedMember
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to toggle divisional team member featured status.", 
      details: e.message 
    };
  }
};

// Update Divisional Team Member Order
export const UpdateDivisionalTeamOrderService = async (req) => {
  try {
    const memberId = new ObjectId(req.params.id);
    const { order } = req.body;
    
    if (typeof order !== 'number') {
      return { status: false, message: "Order must be a number." };
    }
    
    // Get current divisional team member
    const member = await DivisionalTeam.findById(memberId)
      .populate('userId', 'name email avatar district upazila phone');
    
    if (!member) {
      return { status: false, message: "Divisional team member not found." };
    }
    
    // Update the order
    const updatedMember = await DivisionalTeam.findByIdAndUpdate(
      memberId,
      { $set: { order } },
      { new: true }
    );
    
    return {
      status: true,
      message: "Divisional team member order updated successfully.",
      data: updatedMember
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to update divisional team member order.", 
      details: e.message 
    };
  }
};
