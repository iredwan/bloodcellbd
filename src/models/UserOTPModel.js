import mongoose from "mongoose";

const userOTPSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    otp: { type: String },
    otpExpiry: {
      type: Date,
      required: true,
      index: { expires: 120 },
    },
    otpAttempts: { type: Number, default: 0 },
    role: { type: String, default: "user" },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userOTPSchema.index({ expireAfterSeconds: 120, expires: 120 });

export default mongoose.model("UserOTP", userOTPSchema);
