import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import authRoutes from './routes/auth.routes.js';
import businessRoutes from './routes/business.routes.js';
import reviewRoutes from './routes/review.routes.js';

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)   
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('DB error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/businesses', businessRoutes);
app.use('/api/reviews', reviewRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => 
    console.log(`Server running on port ${PORT}`)
);