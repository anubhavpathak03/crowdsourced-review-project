import mongoose from 'mongoose';
import 'dotenv/config';

import User from './src/models/user.models.js';
import Business from './src/models/business.models.js';
import Review from './src/models/review.models.js';

// Connect to MongoDB
await mongoose.connect(process.env.MONGODB_URI);

// Clear existing seed data for a clean demo
await Promise.all([
  User.deleteMany({ email: { $in: ['admin@example.com', 'user@example.com'] } }),
  Business.deleteMany({}),
  Review.deleteMany({}),
]);

// Seed users (admin + regular user), passwords will be hashed by the model hook
const [admin, user] = await User.create(
  {
    name: 'Admin',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
  },
  {
    name: 'Regular User',
    email: 'user@example.com',
    password: 'user123',
    role: 'user',
  },
);

// Seed some example businesses
const businesses = await Business.create(
  {
    name: 'Spice Route Restaurant',
    category: 'Restaurants',
    location: 'Connaught Place, New Delhi',
    description: 'Modern Indian cuisine with a cozy ambiance.',
  },
  {
    name: 'Brew & Bean Café',
    category: 'Cafés',
    location: 'Koramangala, Bengaluru',
    description: 'Specialty coffee, pastries, and work-friendly seating.',
  },
  {
    name: 'Techie Mobile Repair',
    category: 'Services',
    location: 'Noida Sector 18',
    description: 'Same-day mobile and laptop repair service.',
  },
  {
    name: 'City View Hotel',
    category: 'Hotels',
    location: 'Marine Drive, Mumbai',
    description: 'Budget-friendly hotel with sea-facing rooms.',
  },
);

// Seed a couple of sample reviews (one approved, one pending)
await Review.create(
  {
    business: businesses[0]._id,
    author: user._id,
    text: 'Great flavours and quick service. A bit crowded on weekends.',
    ratings: { quality: 5, service: 4, value: 4 },
    status: 'approved',
  },
  {
    business: businesses[1]._id,
    author: user._id,
    text: 'Nice place to work from, Wi‑Fi can be slow at times.',
    ratings: { quality: 4, service: 3, value: 4 },
    status: 'pending',
  },
);

console.log('Seed complete.');
console.log('Admin  -> admin@example.com / admin123');
console.log('User   -> user@example.com / user123');

process.exit(0);