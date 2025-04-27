import mongoose from "mongoose";

const districtTeamSchema = new mongoose.Schema(
  {
    districtId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "District",
      required: [true, "District is required"]
    },
    districtCoordinatorID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "District Coordinator is required"]
    },
    districtSubCoordinatorID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    districtITMediaCoordinatorID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    districtLogisticsCoordinatorID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    upazilaTeamID: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "UpazilaTeam",
    }],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    updatedBy: {  
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    versionKey: false
  }
);

const DistrictTeam = mongoose.model("DistrictTeam", districtTeamSchema);

export default DistrictTeam;
