import mongoose from "mongoose";

const districtTeamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true
    },
    designation: {
      type: String,
      required: [true, "Designation is required"],
      trim: true,
      default: "District Coordinator"
    },
    district: {
      type: String,
      required: [true, "District is required"],
      trim: true
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true
    },
    email: {
      type: String,
      trim: true
    },
    image: {
      type: String,
      trim: true
    },
    bio: {
      type: String,
      trim: true
    },
    order: {
      type: Number,
      default: 0
    },
    active: {
      type: Boolean,
      default: true
    },
    featured: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

const DistrictTeam = mongoose.model("DistrictTeam", districtTeamSchema);

export default DistrictTeam;
