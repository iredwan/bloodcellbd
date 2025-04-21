import BoardTeam from "../models/BoardTeamModel.js";
import mongoose from "mongoose";
import { deleteFile } from "../utility/fileUtils.js";
import path from "path";

const ObjectId = mongoose.Types.ObjectId;

// Create Board Team Member
export const CreateBoardTeamService = async (req) => {
  try {
    const reqBody = req.body;
    
    // Create new board team member
    const newMember = new BoardTeam(reqBody);
    await newMember.save();
    
    return { 
      status: true, 
      message: "Board team member created successfully.",
      data: newMember
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to create board team member.", 
      details: e.message 
    };
  }
};

// Get All Board Team Members
export const GetAllBoardTeamService = async (req) => {
  try {
    // Optional query parameters
    const filter = {};
    
    if (req.query.active === 'true') {
      filter.active = true;
    }
    
    if (req.query.featured === 'true') {
      filter.featured = true;
    }
    
    // Get all board team members with filters
    const members = await BoardTeam.find(filter).sort({ order: 1 });
    
    if (!members || members.length === 0) {
      return { status: false, message: "No board team members found." };
    }
    
    return {
      status: true,
      data: members,
      message: "Board team members retrieved successfully.",
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to retrieve board team members.", 
      details: e.message 
    };
  }
};

// Get Board Team Member By ID
export const GetBoardTeamByIdService = async (req) => {
  try {
    const memberId = new ObjectId(req.params.id);
    
    const member = await BoardTeam.findById(memberId);
    
    if (!member) {
      return { status: false, message: "Board team member not found." };
    }
    
    return {
      status: true,
      data: member,
      message: "Board team member retrieved successfully.",
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to retrieve board team member.", 
      details: e.message 
    };
  }
};

// Update Board Team Member
export const UpdateBoardTeamService = async (req) => {
  try {
    const memberId = new ObjectId(req.params.id);
    const reqBody = req.body;
    
    // Check if board team member exists
    const currentMember = await BoardTeam.findById(memberId);
    
    if (!currentMember) {
      return { status: false, message: "Board team member not found." };
    }
    
    // If updating image, delete the old one
    if (reqBody.image && currentMember.image && reqBody.image !== currentMember.image) {
      const fileName = path.basename(currentMember.image);
      await deleteFile(fileName);
    }
    
    // Update board team member
    const updatedMember = await BoardTeam.findByIdAndUpdate(
      memberId,
      { $set: reqBody },
      { new: true, runValidators: true }
    );
    
    return {
      status: true,
      data: updatedMember,
      message: "Board team member updated successfully.",
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to update board team member.", 
      details: e.message 
    };
  }
};

// Delete Board Team Member
export const DeleteBoardTeamService = async (req) => {
  try {
    const memberId = req.params.id;
    
    if (!ObjectId.isValid(memberId)) {
      return { status: false, message: "Invalid board team member ID." };
    }
    
    // Get member before deletion to access image
    const member = await BoardTeam.findById(memberId);
    
    if (!member) {
      return { status: false, message: "Board team member not found or already deleted." };
    }
    
    // Delete the image file if it exists
    if (member.image) {
      const fileName = path.basename(member.image);
      await deleteFile(fileName);
    }
    
    // Delete the board team member
    const deletedMember = await BoardTeam.findByIdAndDelete(memberId);
    
    return {
      status: true,
      message: "Board team member deleted successfully.",
      data: deletedMember
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to delete board team member.", 
      details: e.message 
    };
  }
};

// Toggle Board Team Member Active Status
export const ToggleBoardTeamActiveService = async (req) => {
  try {
    const memberId = new ObjectId(req.params.id);
    
    // Get current board team member
    const member = await BoardTeam.findById(memberId);
    
    if (!member) {
      return { status: false, message: "Board team member not found." };
    }
    
    // Toggle the active status
    const updatedMember = await BoardTeam.findByIdAndUpdate(
      memberId,
      { $set: { active: !member.active } },
      { new: true }
    );
    
    return {
      status: true,
      message: `Board team member ${updatedMember.active ? 'activated' : 'deactivated'} successfully.`,
      data: updatedMember
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to toggle board team member status.", 
      details: e.message 
    };
  }
};

// Toggle Board Team Member Featured Status
export const ToggleBoardTeamFeaturedService = async (req) => {
  try {
    const memberId = new ObjectId(req.params.id);
    
    // Get current board team member
    const member = await BoardTeam.findById(memberId);
    
    if (!member) {
      return { status: false, message: "Board team member not found." };
    }
    
    // Toggle the featured status
    const updatedMember = await BoardTeam.findByIdAndUpdate(
      memberId,
      { $set: { featured: !member.featured } },
      { new: true }
    );
    
    return {
      status: true,
      message: `Board team member ${updatedMember.featured ? 'featured' : 'unfeatured'} successfully.`,
      data: updatedMember
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to toggle board team member featured status.", 
      details: e.message 
    };
  }
};

// Update Board Team Member Order
export const UpdateBoardTeamOrderService = async (req) => {
  try {
    const memberId = new ObjectId(req.params.id);
    const { order } = req.body;
    
    if (typeof order !== 'number') {
      return { status: false, message: "Order must be a number." };
    }
    
    // Get current board team member
    const member = await BoardTeam.findById(memberId);
    
    if (!member) {
      return { status: false, message: "Board team member not found." };
    }
    
    // Update the order
    const updatedMember = await BoardTeam.findByIdAndUpdate(
      memberId,
      { $set: { order } },
      { new: true }
    );
    
    return {
      status: true,
      message: "Board team member order updated successfully.",
      data: updatedMember
    };
  } catch (e) {
    return { 
      status: false, 
      message: "Failed to update board team member order.", 
      details: e.message 
    };
  }
};
