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
      default: null
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
      enum: ["platinum", "gold", "silver", "bronze", "other"],
      default: "other"
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
