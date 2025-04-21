import mongoose from 'mongoose';

const CarouselSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  linkUrl: { type: String },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
},
{
  timestamps: true,
  versionKey: false
});

const CarouselModel = mongoose.model('Carousel', CarouselSchema);

export default CarouselModel;
