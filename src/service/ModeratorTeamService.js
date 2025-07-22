import ModeratorTeamModel from "../models/ModeratorTeamModel.js";
import mongoose from "mongoose";
import UserModel from "../models/UserModel.js";

const ObjectId = mongoose.Types.ObjectId;

// Create Moderator Team
export const CreateModeratorTeamService = async (req) => {
  try {
    // Get user ID from headers or cookies for createdBy field
    const createdById =
      req.headers.user_id || (req.cookies && req.cookies.user_id);

    if (!createdById || !ObjectId.isValid(createdById)) {
      return {
        status: false,
        message: "Valid user ID is required in headers or cookies.",
      };
    }

    const reqBody = req.body;
    const monitorId = reqBody.monitor;
    const moderatorName = reqBody.moderatorName;
    let { moderatorTeamMembers } = reqBody;
    const user = await UserModel.findById(moderatorName);

    // Check if moderator is found
    if (!user) {
      return {
        status: false,
        message: "Moderator not found with this ID.",
      };
    }

    // Check if added moderator role is not moderator
    if (user.role !== "Moderator") {
      return {
        status: false,
        message: "You have to set this user as a moderator first.",
      };
    }

    if (monitorId) {
      reqBody.monitor = new ObjectId(monitorId);
    } else {
      const monitor = await UserModel.findById(createdById);
      if (monitor && monitor.role === "Monitor") {
        reqBody.monitor = new ObjectId(monitor._id);
      } else {
        return {
          status: false,
          message: "You have to select a monitor first.",
        };
      }
    }    
    

    // Check if moderator team name is provided
    const moderatorTeamName =
      reqBody.moderatorTeamName || user.name + "'s Team";

    // Check if required fields are provided
    if (!moderatorTeamName || !moderatorName) {
      return {
        status: false,
        message: "Moderator team name and moderator name are required.",
      };
    }

    // Check if team name already exists
    const existingTeam = await ModeratorTeamModel.findOne({
      moderatorTeamName,
    });
    if (existingTeam) {
      return {
        status: false,
        message: "Moderator team with this name already exists.",
      };
    }

    // Check if Moderator is already in a team
    const existingModerator = await ModeratorTeamModel.findOne({
      moderatorName,
    });
    if (existingModerator) {
      return {
        status: false,
        message: "Moderator is already in a team.",
      };
    }

    // Check if added members are found
    const addedMembersNotFound = await UserModel.find({
      _id: { $in: moderatorTeamMembers },
    });
    if (addedMembersNotFound.length !== moderatorTeamMembers.length) {
      return {
        status: false,
        message: "Members are not found.",
      };
    }

    // Check if added members are only users and update their role to "Member"
    const membersToUpdate = [];
    for (const memberId of moderatorTeamMembers) {
      const member = await UserModel.findById(memberId);
      if (member && member.role === "user") {
        membersToUpdate.push(memberId);
      }
    }

    // Update users to Members if needed
    if (membersToUpdate.length > 0) {
      await UserModel.updateMany(
        { _id: { $in: membersToUpdate } },
        { $set: { role: "Member" } }
      );
    

    // Check user have role as Member
    const userRole = await UserModel.findOne({ _id: moderatorTeamMembers });
    if (userRole.role !== "Member") {
      return {
        status: false,
        message: `You can't add a ${userRole.role} to a moderator team. You can add only a "Member" to a moderator team.`,
      };
    }

    }

    // Check if added members are already in a team
    const addedMembers = await ModeratorTeamModel.findOne({
      moderatorTeamMembers: { $in: moderatorTeamMembers },
    });
    if (addedMembers) {
      return {
        status: false,
        message: "Members are already in a team.",
      };
    }

    // Create new moderator team
    const newModeratorTeam = await ModeratorTeamModel.create({
      moderatorTeamName,
      moderatorName,
      monitor: reqBody.monitor,
      moderatorTeamMembers: moderatorTeamMembers || [],
      createdBy: createdById,
    });

    return {
      status: true,
      message: "Moderator team created successfully.",
      data: newModeratorTeam,
    };
  } catch (e) {
    return {
      status: false,
      message: "Failed to create moderator team.",
      details: e.message,
    };
  }
};

// Get All Moderator Teams
export const GetAllModeratorTeamsService = async (req) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const districtName = req.query.districtName;
    const upazilaName = req.query.upazilaName;

    let query = {};
    if (districtName) {
      query.districtName = { $regex: districtName, $options: "i" };
    }
    if (upazilaName) {
      query.upazilaName = { $regex: upazilaName, $options: "i" };
    }

    // ✅ Count total documents (before pagination)
    const totalItems = await ModeratorTeamModel.countDocuments(query);

    // ✅ Find paginated data
    const moderatorTeams = await ModeratorTeamModel.find(query)
      .skip(skip)
      .limit(limit)
      .populate(
        "moderatorName",
        "name phone role roleSuffix profileImage isVerified bloodGroup lastDonate nextDonationDate"
      )
      .populate(
        "moderatorTeamMembers",
        "name phone nextDonationDate alternatePhone role roleSuffix profileImage isVerified bloodGroup lastDonate"
      )
      .populate({
        path: "createdBy",
        select: "name phone profileImage role roleSuffix isVerified bloodGroup lastDonate nextDonationDate",
      })
      .populate({
        path: "updatedBy",
        select: "name phone profileImage role roleSuffix isVerified bloodGroup lastDonate nextDonationDate",
      });

    if (!moderatorTeams || moderatorTeams.length === 0) {
      return {
        status: false,
        message: "No moderator teams found.",
      };
    }

    // ✅ Count team members
    const totalTeamMembers = moderatorTeams.reduce((total, team) => {
      const teamMembersCount = team.moderatorTeamMembers?.length || 0;
      return total + teamMembersCount + 1; // +1 for moderator
    }, 0);

    return {
      status: true,
      message: "All moderator teams retrieved successfully.",
      data: {
        moderatorTeams,
        totalTeamMembers,
        pagination: {
          totalItems,
          currentPage: page,
          itemsPerPage: limit,
          totalPages: Math.ceil(totalItems / limit),
        },
      },
    };
  } catch (e) {
    return {
      status: false,
      message: "Failed to retrieve moderator teams.",
      details: e.message,
    };
  }
};

// Get Moderator Team By ID
export const GetModeratorTeamByIdService = async (req) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return {
        status: false,
        message: "Invalid moderator team ID.",
      };
    }

    const moderatorTeam = await ModeratorTeamModel.findById(id)
      .populate(
        "moderatorName",
        "name phone role roleSuffix profileImage isVerified bloodGroup lastDonate nextDonationDate"
      )
      .populate(
        "moderatorTeamMembers",
        "name phone nextDonationDate alternatePhone role roleSuffix profileImage isVerified bloodGroup lastDonate"
      )
      .populate("createdBy", "name phone profileImage role roleSuffix isVerified bloodGroup lastDonate nextDonationDate")
      .populate("updatedBy", "name phone profileImage role roleSuffix isVerified bloodGroup lastDonate nextDonationDate");

    // Count total team members
    const totalTeamMembers = moderatorTeam.moderatorTeamMembers
      ? moderatorTeam.moderatorTeamMembers.length
      : 0;

    if (!moderatorTeam) {
      return {
        status: false,
        message: "Moderator team not found.",
      };
    }

    return {
      status: true,
      message: "Moderator team retrieved successfully.",
      data: {
        team: moderatorTeam,
        totalTeamMembers,
      },
    };
  } catch (e) {
    return {
      status: false,
      message: "Failed to retrieve moderator team.",
      details: e.message,
    };
  }
};

// Get Moderator Team By Moderator User ID
export const GetModeratorTeamByModeratorUserIdService = async (req) => {
  try {
    const userId = req.headers.user_id || req.cookies.user_id;
    const moderatorTeam = await ModeratorTeamModel.find({ moderatorName: userId }).populate(
      "moderatorName",
      "name phone role roleSuffix profileImage isVerified bloodGroup lastDonate nextDonationDate"
    )
    .populate(
      "moderatorTeamMembers",
      "name phone nextDonationDate alternatePhone role roleSuffix profileImage isVerified bloodGroup lastDonate"
    )
    .populate("createdBy", "name phone profileImage role roleSuffix isVerified bloodGroup lastDonate nextDonationDate")
    .populate("updatedBy", "name phone profileImage role roleSuffix isVerified bloodGroup lastDonate nextDonationDate");
    return {
      status: true,
      message: "Moderator team retrieved successfully.",
      data: moderatorTeam,
    };
  } catch (e) {
    return {
      status: false,
      message: "Failed to retrieve moderator team.",
      details: e.message,
    };
  }
}
// Update Moderator Team
export const UpdateModeratorTeamService = async (req) => {
  try {
    // Get user ID from headers or cookies for updatedBy field
    const updatedById =
      req.headers.user_id || (req.cookies && req.cookies.user_id);

    if (!updatedById || !ObjectId.isValid(updatedById)) {
      return {
        status: false,
        message: "Valid user ID is required in headers or cookies.",
      };
    }
    const reqBody = req.body;
    const id = req.params.id;
    const moderatorTeamName = reqBody.moderatorTeamName;

    if (!ObjectId.isValid(id)) {
      return {
        status: false,
        message: "Invalid moderator team ID.",
      };
    }

    // Check if moderator team exists
    const existingTeam = await ModeratorTeamModel.findById(id);
    if (!existingTeam) {
      return {
        status: false,
        message: "Moderator team not found.",
      };
    }

    // Check if team name already exists (if updating team name)
    if (
      moderatorTeamName &&
      moderatorTeamName !== existingTeam.moderatorTeamName
    ) {
      const teamWithName = await ModeratorTeamModel.findOne({
        moderatorTeamName: moderatorTeamName,
        _id: { $ne: id },
      });

      if (teamWithName) {
        return {
          status: false,
          message: "Another moderator team with this name already exists.",
        };
      }
    }

    // Merge existing data with new data
    const updatedData = {
      ...existingTeam.toObject(),
      ...reqBody,
    };

    // Add updatedBy field to the updated data
    updatedData.updatedBy = updatedById;

    // Update moderator team
    const updatedModeratorTeam = await ModeratorTeamModel.findByIdAndUpdate(
      id,
      { $set: updatedData },
      { new: true, runValidators: true }
    )
      .populate("moderatorName", "name phone role roleSuffix profileImage isVerified bloodGroup lastDonate nextDonationDate")
      .populate("moderatorTeamMembers", "name phone nextDonationDate alternatePhone role roleSuffix profileImage isVerified bloodGroup lastDonate");

    return {
      status: true,
      message: "Moderator team updated successfully.",
      data: updatedModeratorTeam,
    };
  } catch (e) {
    return {
      status: false,
      message: "Failed to update moderator team.",
      details: e.message,
    };
  }
};

// Delete Moderator Team
export const DeleteModeratorTeamService = async (req) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return {
        status: false,
        message: "Invalid moderator team ID.",
      };
    }

    // Check if moderator team exists
    const existingTeam = await ModeratorTeamModel.findById(id);
    if (!existingTeam) {
      return {
        status: false,
        message: "Moderator team not found.",
      };
    }

    // Delete moderator team
    const deletedModeratorTeam = await ModeratorTeamModel.findByIdAndDelete(id);

    return {
      status: true,
      message: "Moderator team deleted successfully.",
      data: deletedModeratorTeam,
    };
  } catch (e) {
    return {
      status: false,
      message: "Failed to delete moderator team.",
      details: e.message,
    };
  }
};

// Add Member to Moderator Team
export const AddTeamMemberService = async (req) => {
  try {
    // Get user ID from headers or cookies for createdBy field
    const updatedById =
      req.headers.user_id || (req.cookies && req.cookies.user_id);
    if (!updatedById || !ObjectId.isValid(updatedById)) {
      return {
        status: false,
        message: "Valid user ID is required in headers or cookies.",
      };
    }

    const id = req.params.teamId;
    const memberId = req.body.memberId;
    if (!ObjectId.isValid(id) || !ObjectId.isValid(memberId)) {
      return {
        status: false,
        message: "Invalid moderator team ID or member ID.",
      };
    }

    // Check if moderator team exists
    const existingTeam = await ModeratorTeamModel.findById(id);
    if (!existingTeam) {
      return {
        status: false,
        message: "Moderator team not found.",
      };
    }

    // Check if member is already in the team
    if (existingTeam.moderatorTeamMembers.includes(memberId)) {
      return {
        status: false,
        message: "Member is already in the team.",
      };
    }

    // Check if member role is not Member or user
    const memberRole = await UserModel.findById(memberId);
    if (memberRole.role !== "Member" && memberRole.role !== "user") {
      return {
        status: false,
        message: `You can't add a ${memberRole.role} to a moderator team. You can add only a "Member" or "user" to a moderator team.`,
      };
    }

    // Set member role to Member if it is user
    if (memberRole.role === "user") {
      await UserModel.findByIdAndUpdate(memberId, { $set: { role: "Member" } });
    }

    // set updatedBy field to createdBy
    const updatedBy = {
      updatedBy: updatedById,
    };

    // Add member to team
    await ModeratorTeamModel.findByIdAndUpdate(
      id,
      { $addToSet: { moderatorTeamMembers: memberId }, ...updatedBy },
      { new: true, runValidators: true }
    );
    return {
      status: true,
      message: "Member added to team successfully.",
    };
  } catch (e) {
    return {
      status: false,
      message: "Failed to add member to team.",
      details: e.message,
    };
  }
};

// Remove Member from Moderator Team
export const RemoveTeamMemberService = async (req) => {
  try {
    const id = req.params.teamId;
    const memberId = req.body.memberId;
    if (!ObjectId.isValid(id) || !ObjectId.isValid(memberId)) {
      return {
        status: false,
        message: "Invalid moderator team ID or member ID.",
      };
    }

    // Check if moderator team exists
    const existingTeam = await ModeratorTeamModel.findById(id);
    if (!existingTeam) {
      return {
        status: false,
        message: "Moderator team not found.",
      };
    }

    // Check if member is in the team
    if (!existingTeam.moderatorTeamMembers.includes(memberId)) {
      return {
        status: false,
        message: "Member is not in the team.",
      };
    }

    // Remove member from team
    const updatedTeam = await ModeratorTeamModel.findByIdAndUpdate(
      id,
      { $pull: { moderatorTeamMembers: memberId } },
      { new: true, runValidators: true }
    )
      .populate("moderatorName", "name email phone")
      .populate("moderatorTeamMembers", "name email phone");

    return {
      status: true,
      message: "Member removed from team successfully.",
      data: updatedTeam,
    };
  } catch (e) {
    return {
      status: false,
      message: "Failed to remove member from team.",
      details: e.message,
    };
  }
};

// Get All Moderator Teams By Monitor User ID
export const GetAllModeratorTeamsByMonitorUserIdService = async (req) => {
  try {
    const userId = req.headers.user_id || req.cookies.user_id;
    const moderatorTeams = await ModeratorTeamModel.find({ monitor: userId }).populate("moderatorName", "name phone role roleSuffix profileImage isVerified bloodGroup lastDonate nextDonationDate")
      .populate("moderatorTeamMembers", "name phone nextDonationDate alternatePhone role roleSuffix profileImage isVerified bloodGroup lastDonate");
    return {
      status: true,
      message: "All moderator teams retrieved successfully.",
      data: moderatorTeams,
    };
  } catch (e) {
    return {
      status: false,
      message: "Failed to retrieve moderator teams.",
      details: e.message,
    };
  }
}

// Get Moderator Team By Member User ID
export const GetAllModeratorTeamsByMemberUserIdService = async (req) => {
  try {
    const userId = req.headers.user_id || req.cookies.user_id;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return {
        status: false,
        message: "Valid user ID is required.",
      };
    }

    const moderatorTeams = await ModeratorTeamModel.find({ moderatorTeamMembers: userId })
      .populate("moderatorName", "name phone role roleSuffix profileImage isVerified bloodGroup lastDonate nextDonationDate")
      .populate("moderatorTeamMembers", "name phone nextDonationDate alternatePhone role roleSuffix profileImage isVerified bloodGroup lastDonate")
      .lean();

    return {
      status: true,
      message: "All moderator teams retrieved successfully.",
      data: moderatorTeams,
    };
  } catch (e) {
    return {
      status: false,
      message: "Failed to retrieve moderator teams.",
      details: e.message,
    };
  }
};
