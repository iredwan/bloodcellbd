import mongoose from 'mongoose';
const { Schema } = mongoose;

const hospitalSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Hospital name is required'],
    trim: true
  },
  district: {
    type: String,
    required: [true, 'District is required'],
    trim: true
  },
  upazila: {
    type: String,
    required: [true, 'Upazila is required'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  contact: { type: String, },
  email: { type: String, },
  website: { type: String, },
  beds: { type: Number, },
  specialties: { type: String, },

  
  
}, {
  timestamps: true,
  versionKey: false
});

const Hospital = mongoose.model('Hospital', hospitalSchema);

export default Hospital;
