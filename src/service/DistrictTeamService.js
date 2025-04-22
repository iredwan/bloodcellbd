import DistrictTeam from "../models/DistrictTeamModel.js";
import mongoose from "mongoose";
import { deleteFile } from "../utility/fileUtils.js";
import path from "path";
import UserModel from "../models/UserModel.js";
const ObjectId = mongoose.Types.ObjectId;

// Create District Team Member
export const CreateDistrictTeamService = async (req) => {
  try {
    const reqBody = req.body;
    const userId = reqBody.userId;

    const user = await UserModel.findById(userId);
    if (!user) {
      return { status: false, message: "User not found." };
    }

    const districtTeam = await DistrictTeam.findOne({ userId });
    if (districtTeam) {
      return { status: false, message: "District team member already exists." };
    }
    
    // Create new district team member
    const newMember = new DistrictTeam(reqBody);
    await newMember.save();
    
    return { 
      status: true, 
      message: "District team member created successfully.",
      data: newMember
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to create district team member.", 
      details: e.message 
    };
  }
};

// Get All District Team Members
export const GetAllDistrictTeamService = async (req) => {
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
    
    // Get all district team members with filters
    const members = await DistrictTeam.find(filter)
      .populate('userId', 'name email avatar district upazila phone')
      .sort({ order: 1 });
    
    if (!members || members.length === 0) {
      return { status: false, message: "No district team members found." };
    }
    
    return {
      status: true,
      data: members,
      message: "District team members retrieved successfully.",
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to retrieve district team members.", 
      details: e.message 
    };
  }
};

// Get District Team Member By ID
export const GetDistrictTeamByIdService = async (req) => {
  try {
    const memberId = new ObjectId(req.params.id);
    
    const member = await DistrictTeam.findById(memberId)
      .populate('userId', 'name email avatar district upazila phone');
    
    if (!member) {
      return { status: false, message: "District team member not found." };
    }
    
    return {
      status: true,
      data: member,
      message: "District team member retrieved successfully.",
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to retrieve district team member.", 
      details: e.message 
    };
  }
};

// Get District Team Members By District
export const GetDistrictTeamByDistrictService = async (req) => {
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
    
    const members = await DistrictTeam.find(filter)
      .populate('userId', 'name email avatar district upazila phone')
      .sort({ order: 1 });
    
    if (!members || members.length === 0) {
      return { status: false, message: `No district team members found for ${district} district.` };
    }
    
    return {
      status: true,
      data: members,
      message: `District team members for ${district} district retrieved successfully.`,
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to retrieve district team members by district.", 
      details: e.message 
    };
  }
};

// Update District Team Member
export const UpdateDistrictTeamService = async (req) => {
  try {
    const memberId = new ObjectId(req.params.id);
    const reqBody = req.body;
    
    // Check if district team member exists
    const currentMember = await DistrictTeam.findById(memberId)
      .populate('userId', 'name email avatar district upazila phone');
    
    if (!currentMember) {
      return { status: false, message: "District team member not found." };
    }
    
    // If updating image, delete the old one
    if (reqBody.image && currentMember.image && reqBody.image !== currentMember.image) {
      const fileName = path.basename(currentMember.image);
      await deleteFile(fileName);
    }
    
    // Update district team member
    const updatedMember = await DistrictTeam.findByIdAndUpdate(
      memberId,
      { $set: reqBody },
      { new: true, runValidators: true }
    );
    
    return {
      status: true,
      data: updatedMember,
      message: "District team member updated successfully.",
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to update district team member.", 
      details: e.message 
    };
  }
};

// Delete District Team Member
export const DeleteDistrictTeamService = async (req) => {
  try {
    const memberId = req.params.id;
    
    if (!ObjectId.isValid(memberId)) {
      return { status: false, message: "Invalid district team member ID." };
    }
    
    // Get member before deletion to access image
    const member = await DistrictTeam.findById(memberId)
      .populate('userId', 'name email avatar district upazila phone');
    
    if (!member) {
      return { status: false, message: "District team member not found or already deleted." };
    }
    
    // Delete the image file if it exists
    if (member.image) {
      const fileName = path.basename(member.image);
      await deleteFile(fileName);
    }
    
    // Delete the district team member
    const deletedMember = await DistrictTeam.findByIdAndDelete(memberId);
    
    return {
      status: true,
      message: "District team member deleted successfully.",
      data: deletedMember
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to delete district team member.", 
      details: e.message 
    };
  }
};

// Toggle District Team Member Active Status
export const ToggleDistrictTeamActiveService = async (req) => {
  try {
    const memberId = new ObjectId(req.params.id);
    
    // Get current district team member
      const member = await DistrictTeam.findById(memberId)
      .populate('userId', 'name email avatar district upazila phone');
    
    if (!member) {
      return { status: false, message: "District team member not found." };
    }
    
    // Toggle the active status
    const updatedMember = await DistrictTeam.findByIdAndUpdate(
      memberId,
      { $set: { active: !member.active } },
      { new: true }
    );
    
    return {
      status: true,
      message: `District team member ${updatedMember.active ? 'activated' : 'deactivated'} successfully.`,
      data: updatedMember
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to toggle district team member status.", 
      details: e.message 
    };
  }
};

// Toggle District Team Member Featured Status
export const ToggleDistrictTeamFeaturedService = async (req) => {
  try {
    const memberId = new ObjectId(req.params.id);
    
    // Get current district team member
      const member = await DistrictTeam.findById(memberId)
      .populate('userId', 'name email avatar district upazila phone');
    
    if (!member) {
      return { status: false, message: "District team member not found." };
    }
    
    // Toggle the featured status
    const updatedMember = await DistrictTeam.findByIdAndUpdate(
      memberId,
      { $set: { featured: !member.featured } },
      { new: true }
    );
    
    return {
      status: true,
      message: `District team member ${updatedMember.featured ? 'featured' : 'unfeatured'} successfully.`,
      data: updatedMember
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to toggle district team member featured status.", 
      details: e.message 
    };
  }
};

// Update District Team Member Order
export const UpdateDistrictTeamOrderService = async (req) => {
  try {
    const memberId = new ObjectId(req.params.id);
    const { order } = req.body;
    
    if (typeof order !== 'number') {
      return { status: false, message: "Order must be a number." };
    }
    
    // Get current district team member
    const member = await DistrictTeam.findById(memberId)
      .populate('userId', 'name email avatar district upazila phone');
    
    if (!member) {
      return { status: false, message: "District team member not found." };
    }
    
    // Update the order
    const updatedMember = await DistrictTeam.findByIdAndUpdate(
      memberId,
      { $set: { order } },
      { new: true }
    );
    
    return {
      status: true,
      message: "District team member order updated successfully.",
      data: updatedMember
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to update district team member order.", 
      details: e.message 
    };
  }
}; 