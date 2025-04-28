import mongoose from "mongoose";

const wantToDonateBloodSchema = new mongoose.Schema({
  bloodDonorUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Donor User Id is required"],
  },
  date: {
    type: String,
    required: [true, "Date is required"],
  },
  district: {
    type: String,
    required: [true, "District is required"],
  },
  upazila: {
    type: String,
    required: [true, "Upazila is required"],
  },
  message: {
    type: String,
  },
  bloodCollectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  status:{
    type: String,
    enum: ["pending", "collected", "rejected"],
    default: "pending",
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  },
  {
    timestamps: true,
    versionKey: false
  
});

const WantToDonateBlood = mongoose.model("WantToDonateBlood", wantToDonateBloodSchema);

export default WantToDonateBlood;
