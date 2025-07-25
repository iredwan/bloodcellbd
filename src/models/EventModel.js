import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  eventID: {
    type: String,
    required: [true, 'Event ID is required'],
    unique: true,
    trim: true
  },
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
    type: String,
    required: [true, 'Event date is required']
  },
  time: {
    type: String,
    required: [true, 'Event time is required']
  },
  upazila: { type: String, required: true },
  district: { type: String, required: true },
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
    enum: ['Upcoming', 'Ongoing', 'Completed', 'Cancelled'],
    default: 'Upcoming'
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
