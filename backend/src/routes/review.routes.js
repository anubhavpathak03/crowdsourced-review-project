import express from 'express';
import Review from '../models/review.models.js';
import { protect, adminOnly } from '../middleware/authMidleware.js';
import 'dotenv/config';

const router = express.Router();

// GET /api/reviews?businessId=xxx
router.get('/', async (req, res) => {
  const filter = { status: 'approved' };
  if (req.query.businessId) filter.business = req.query.businessId;
  const reviews = await Review.find(filter).populate('author', 'name');
  res.json(reviews);
});

// GET /api/reviews/pending (admin only)
router.get('/pending', protect, adminOnly, async (req, res) => {
  const reviews = await Review.find({ status: 'pending' })
    .populate('author', 'name')
    .populate('business', 'name');
  res.json(reviews);
});

// POST /api/reviews (logged-in users)
router.post('/', protect, async (req, res) => {
  try {
    const review = await Review.create({ ...req.body, author: req.user._id });
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PATCH /api/reviews/:id/status (admin only)
router.patch('/:id/status', protect, adminOnly, async (req, res) => {
  const review = await Review.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { returnDocument: 'after' }
  );
  res.json(review);
});

export default router;