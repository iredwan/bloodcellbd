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
  identificationNumber: {
    type: String,
    required: [true, "NID or birth registration number is required"],
    unique: true,
    trim: true,
  },
  identificationType: {
    type: String,
    enum: ['NID', 'Birth Registration'],
    required: [true, "Identification type is required"],
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
  fatherPhoneNumber: {  
    type: String,
  },
  motherName: {
    type: String,
    required: [true, "Mother name is required"],
  },
  motherPhoneNumber: {
    type: String,
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
  alternatePhone: {
    type: String,
    required: [true, "Alternate phone number is required"],
  },
  whatsappNumber: {
    type: String,
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
    enum: ["user", "Technician", "Member", "Moderator", "Monitor", "Upazila Coordinator", "Upazila Sub-Coordinator", "Upazila IT & Media Coordinator", "Upazila Logistics Coordinator", "District Coordinator", "District Sub-Coordinator", "District IT & Media Coordinator", "District Logistics Coordinator", "Divisional Coordinator", "Divisional Sub-Coordinator", "Head of IT & Media", "Head of Logistics", "Admin"],
    default: "user",
  },
  roleSuffix: {
    type: String,
    default: "",
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  isBanned: {
    type: Boolean,
    default: false,
  },
  profileImage: {
    type: String,
    required: [true, "Profile image is required"],
  },
  nidOrBirthRegistrationImage: {
    type: String,
    required: [true, "NID or birth registration image is required"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  reference: {
    type: mongoose.Schema.Types.Mixed, // Can be either ObjectId or String
    ref: "User",
    default: "Self",
    validate: {
      validator: function(value) {
        return typeof value === 'string' || value instanceof mongoose.Types.ObjectId;
      },
      message: 'Reference must be either a String or ObjectId'
    }
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }
}, {
  timestamps: true,
  versionKey: false
});

const userModel = mongoose.model("User", userSchema);

export default userModel;
