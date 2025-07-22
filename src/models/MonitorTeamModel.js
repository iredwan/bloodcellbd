import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
  districtName: {
    type: String,
    required: [true, "District name is required"],
  },
  upazilaName: {
    type: String,
    required: [true, "Upazila name is required"],
  },
  teamName: {
    type: String,
    required: [true, "Team name is required"],
  },
  teamMonitor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Team monitor is required"],
  },
  moderatorTeamID: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "ModeratorTeam",
    required: [true, "Moderator team members are required"],
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
}, {
  timestamps: true,
  versionKey: false
});

const MonitorTeamModel = mongoose.model("MonitorTeam", teamSchema);

export default MonitorTeamModel;
