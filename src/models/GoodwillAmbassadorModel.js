import mongoose from 'mongoose';
const { Schema } = mongoose;

const goodwillAmbassadorSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  designation: {
    type: String,
    required: [true, 'Designation is required'],
    trim: true,
    enum: ['Goodwill Ambassador', 'Honorable Member']
  },
  profileImage: {
    type: String,
    required: [true, 'Profile image is required'],
    default: ''
  },
  socialMedia: {
    facebook: { type: String, default: '' },
    youtube: { type: String, default: '' },
    instagram: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    tiktok: { type: String, default: '' },
    x: { type: String, default: '' },
    website: { type: String, default: '' }
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
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  versionKey: false
});

const GoodwillAmbassador = mongoose.model('GoodwillAmbassador', goodwillAmbassadorSchema);

export default GoodwillAmbassador;
