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
    twitter: { type: String, default: '' },
    instagram: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    youtube: { type: String, default: '' }
  },
  aboutUs: {
    type: String,
    trim: true
  },
  mission: {
    type: String,
    trim: true
  },
  vision: {
    type: String,
    trim: true
  },
  metaTags: {
    title: { type: String, trim: true },
    description: { type: String, trim: true },
    keywords: { type: String, trim: true }
  },
  maintenanceMode: {
    type: Boolean,
    default: false
  },
  analyticsCode: {
    type: String,
    trim: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  versionKey: false
});

// Update the lastUpdated field on save
websiteConfigSchema.pre('save', function(next) {
  this.lastUpdated = Date.now();
  next();
});

const WebsiteConfig = mongoose.model('WebsiteConfig', websiteConfigSchema);

export default WebsiteConfig;
