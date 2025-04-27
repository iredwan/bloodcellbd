import mongoose from "mongoose";

const sponsorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Sponsor name is required"],
      trim: true
    },
    logo: {
      type: String,
      required: [true, "Sponsor logo is required"],
    },
    coverImage: {
      type: String,
      required: [true, "Sponsor cover image is required"],
    },
    website: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    contactPerson: {
      name: String,
      email: String,
      phone: String
    },
    sponsorType: {
      type: String,
      enum: ["Platinum", "Gold", "Silver", "Bronze", "Other"],
      default: "Other"
    },
    events: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event"
    }],
    active: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

const Sponsor = mongoose.model("Sponsor", sponsorSchema);

export default Sponsor;
