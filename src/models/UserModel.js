import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  dob: {
    type: String,
    required: [true, "Date of birth is required"],
  },
  gender: {
    type: String,
    required: [true, "Gender is required"],
  },
  religion: {
    type: String,
    required: [true, "Religion is required"],
  },
  occupation: {
    type: String,
    required: [true, "Occupation is required"],
  },
  fatherName: {
    type: String,
    required: [true, "Father name is required"],
  },
  motherName: {
    type: String,
    required: [true, "Mother name is required"],
  },
  smoking: {
    type: Boolean,
    default: false,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
  },
  password: {
    type: String,
    required: true,
    set: (password) => {
      return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    },
  },
  bloodGroup: {
    type: String,
    required: [true, "Blood group is required"],
  },
  lastDonate: {
    type: String,
    required: true,
  },
  eligibility: {
    type: Boolean,
    default: false,
  },
  nextDonationDate: {
    type: String,
    required: true,
  },
  district: {
    type: String,
    required: [true, "District is required"],
  },
  upazila: {
    type: String,
    required: [true, "Upazila is required"],
  },
  role: {
    type: String,
    enum: ["user", "volunteer", "dist-coordinator", "admin"],
    default: "user",
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  isBanned: {
    type: Boolean,
    default: false,
  },
  avatar: {
    type: String,
  }
}, {
  timestamps: true,
  versionKey: false
});

const userModel = mongoose.model("User", userSchema);

export default userModel;
