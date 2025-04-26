import mongoose from "mongoose";

const upazilaOrPSSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Upazila/PS name is required"],
    trim: true
  },
  bengaliName: {
    type: String,
    required: [true, "Bengali name is required"],
    trim: true
  },
  district: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "District",
    required: [true, "District is required"]
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  versionKey: false
});

const UpazilaOrPSModel = mongoose.model("UpazilaOrPS", upazilaOrPSSchema);

export default UpazilaOrPSModel;
