import mongoose from 'mongoose';

const RequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bloodGroup: { type: String, required: true },
  bloodUnit: { type: Number, required: true },
  hospitalName: { type: String, required: true },
  upazila: { type: String, required: true },
  district: { type: String, required: true },
  contactNumber: { type: String, required: true },
  contactRelation: { type: String, required: true },
  description: { type: String},
  status: { type: String, enum: ['pending', 'fulfilled'], default: 'pending' },
  fulfilledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
},
  {
    timestamps: true,
    versionKey: false
});

const RequestModel = mongoose.model('Request', RequestSchema);

export default RequestModel;