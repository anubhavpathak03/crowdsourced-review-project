import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  author:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text:     { type: String, required: true },
  ratings: {
    quality: { type: Number, min: 1, max: 5, required: true },
    service: { type: Number, min: 1, max: 5, required: true },
    value:   { type: Number, min: 1, max: 5, required: true },
  },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
}, { timestamps: true });

export default mongoose.model('Review', reviewSchema);