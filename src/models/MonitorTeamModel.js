import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
  teamName: {
    type: String,
    required: [true, "Team name is required"],
  },
  teamMonitor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Team monitor is required"],
  },
  designation: {
    type: String,
    required: true, 
    default: "Monitor",
  },
  moderatorTeamID: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "ModeratorTeam",
    required: [true, "Moderator team members are required"],
  }],
}, {
  timestamps: true,
  versionKey: false
});

const MonitorTeamModel = mongoose.model("MonitorTeam", teamSchema);

export default MonitorTeamModel;
