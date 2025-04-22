import mongoose from "mongoose";

const districtTeamSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"]
    },
    designation: {
      type: String,
      required: [true, "Designation is required"],
      trim: true
    },
    socialLinks: {
      facebook: String,
      whatsapp: String,
      linkedin: String,
      instagram: String
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
