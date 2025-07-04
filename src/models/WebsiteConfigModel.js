import mongoose from 'mongoose';
const { Schema } = mongoose;

const websiteConfigSchema = new Schema({
  logo: {
    type: String,
    required: [true, 'Logo is required'],
    default: ''
  },
  favicon: {
    type: String,
    default: ''
  },
  contactInfo: {
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
    },
    phone: {
      type: String,
      trim: true
    },
    address: {
      type: String,
      trim: true
    }
  },
  socialMedia: {
    facebook: { type: String, default: '' },
    instagram: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    youtube: { type: String, default: '' }
  }
}, {
  timestamps: true,
  versionKey: false
});


const WebsiteConfig = mongoose.model('WebsiteConfig', websiteConfigSchema);

export default WebsiteConfig;
