import mongoose from "mongoose";

const boardTeamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"]
  },
  position: {
    type: String,
    required: [true, "Position is required"]
  },
  bio: {
    type: String,
    required: [true, "Bio is required"]
  },
  image: {
    type: String
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
