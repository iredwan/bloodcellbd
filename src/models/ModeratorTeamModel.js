import mongoose from "mongoose";

const moderatorTeamSchema = new mongoose.Schema({
    districtName: {
        type: String,
    },
    upazilaName: {
        type: String,
    },
    moderatorTeamName: {
        type: String,
    },
    monitor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Monitor userID is required"]
    },
    moderatorName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Moderator userID is required"]
    },
    moderatorTeamMembers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {
  timestamps: true,
  versionKey: false
});

const ModeratorTeamModel = mongoose.model("ModeratorTeam", moderatorTeamSchema);

export default ModeratorTeamModel;
