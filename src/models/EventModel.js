import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true
  },
  eventCard: {
    type: String,
    required: [true, 'Event cart is required'],
    default: ''
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'Event date is required']
  },
  time: {
    type: String,
    required: [true, 'Event time is required']
  },
  upazila: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UpazilaOrPS',
    required: [true, 'Upazila is required']
  },
  district: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'District',
    required: [true, 'District is required']
  },
  googleMapLink: {
    type: String,
    default: ''
  },
  image: {
    type: [String],
    default: [],
    validate: {
      validator: function(v) {
        return v.length <= 5;
      },
      message: 'Maximum 5 images allowed'
    }
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sponsor',
    default: null

  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  versionKey: false
});

const Event = mongoose.model('Event', eventSchema);

export default Event;
