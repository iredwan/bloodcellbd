import mongoose from 'mongoose';

const RequestSchema = new mongoose.Schema({
  requestId: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bloodGroup: { type: String, required: true },
  bloodUnit: { type: Number, required: true },
  date: { type: String, required: true },
  hospitalName: { type: String, required: true },
  upazila: { type: String, required: true },
  district: { type: String, required: true },
  contactNumber: { type: String, required: true },
  contactRelation: { type: String, required: true },
  whatsappNumber: { type: String},
  description: { type: String},
  status: { type: String, enum: ['pending', 'fulfilled', 'processing', 'cancelled', 'rejected'], default: 'pending' },
  volunteerName: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  processingBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  fulfilledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
},
  {
    timestamps: true,
    versionKey: false
});

const RequestModel = mongoose.model('Request', RequestSchema);

export default RequestModel;