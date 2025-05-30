import mongoose from "mongoose";

const boardTeamSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User is required"]
  },
  designation: {
    type: String,
    required: [true, "Designation is required"]
  },
  bio: {
    type: String,
    required: [true, "Bio is required"]
  },
  socialLinks: {
    facebook: String,
    whatsapp: String,
    linkedin: String,
    instagram: String
  },
  active: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  versionKey: false
});

const BoardTeam = mongoose.model("BoardTeam", boardTeamSchema);

export default BoardTeam;
