import mongoose from "mongoose";

const districtSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "District name is required"],
    unique: true,
    trim: true
  },
  bengaliName: {
    type: String,
    required: [true, "Bengali name is required"],
    trim: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  versionKey: false
});

const DistrictModel = mongoose.model("District", districtSchema);

export default DistrictModel;
