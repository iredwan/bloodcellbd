import mongoose from 'mongoose';
const { Schema } = mongoose;

const goodwillAmbassadorSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
  },
  phone: {
    type: String,
    trim: true
  },
  profileImage: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    trim: true
  },
  socialMedia: {
    facebook: { type: String, default: '' },
    twitter: { type: String, default: '' },
    instagram: { type: String, default: '' },
    linkedin: { type: String, default: '' }
  },
  position: {
    type: String,
    trim: true
  },
  organization: {
    type: String,
    trim: true
  },
  achievements: [String],
  events: [{
    type: Schema.Types.ObjectId,
    ref: 'Event'
  }],
  active: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  versionKey: false
});

// Update the updatedAt field on save
goodwillAmbassadorSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const GoodwillAmbassador = mongoose.model('GoodwillAmbassador', goodwillAmbassadorSchema);

export default GoodwillAmbassador;
