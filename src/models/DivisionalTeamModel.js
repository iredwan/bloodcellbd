import mongoose from "mongoose";

const divisionalTeamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"]
  },
  position: {
    type: String,
    required: [true, "Position is required"]
  },
  division: {
    type: String,
    required: [true, "Division is required"]
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

const DivisionalTeam = mongoose.model("DivisionalTeam", divisionalTeamSchema);

export default DivisionalTeam;
