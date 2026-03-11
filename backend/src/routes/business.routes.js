import express from 'express';
import Business from '../models/business.models.js';
import { protect, adminOnly } from '../middleware/authMidleware.js';
import 'dotenv/config';

const router = express.Router();

// GET /api/businesses
router.get('/', async (req, res) => {
  const { category } = req.query;
  const filter = category ? { category } : {};
  const businesses = await Business.find(filter);
  res.json(businesses);
});

// GET /api/businesses/:id
router.get('/:id', async (req, res) => {
  const biz = await Business.findById(req.params.id);
  if (!biz) return res.status(404).json({ message: 'Not found' });
  res.json(biz);
});

// POST /api/businesses (admin only)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const biz = await Business.create(req.body);
    res.status(201).json(biz);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/businesses/:id (admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  await Business.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

export default router;