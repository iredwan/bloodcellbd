import mongoose from "mongoose";

const moderatorTeamSchema = new mongoose.Schema({
    moderatorTeamName: {
        type: String,
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
    reference: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {
  timestamps: true,
  versionKey: false
});

const ModeratorTeamModel = mongoose.model("ModeratorTeam", moderatorTeamSchema);

export default ModeratorTeamModel;
