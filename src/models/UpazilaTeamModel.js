import mongoose from "mongoose";

const upazilaTeamSchema = new mongoose.Schema({
  upazilaName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UpazilaOrPS",
    required: [true, "Upazila is required"]
  },
  upazilaCoordinator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Upazila Coordinator is required"]
  },
  upazilaSubCoordinator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  upazilaITMediaCoordinator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  upazilaLogisticsCoordinator: {  
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  monitorTeams:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: "MonitorTeam",
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }
}, {
  timestamps: true,
  versionKey: false
});

const UpazilaTeam = mongoose.model("UpazilaTeam", upazilaTeamSchema);

export default UpazilaTeam;

