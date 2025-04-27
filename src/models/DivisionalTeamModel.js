import mongoose from "mongoose";

const divisionalTeamSchema = new mongoose.Schema({
  divisionID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Division",
    required: [true, "Division is required"]
  },
  divisionalCoordinatorID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User is required"]
  },
  divisionalSubCoordinatorID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  
  districtTeamID: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "DistrictTeam",
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  updatedBy: {  
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

}, {
  timestamps: true,
  versionKey: false
});

const DivisionalTeam = mongoose.model("DivisionalTeam", divisionalTeamSchema);

export default DivisionalTeam;
