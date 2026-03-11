import mongoose from 'mongoose';

const businessSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  category:    { type: String, required: true },
  location:    { type: String, required: true },
  description: { type: String },
}, { timestamps: true });

export default mongoose.model('Business', businessSchema);