import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.models.js';
import 'dotenv/config';

const router = express.Router();

const makeToken = (id) => jwt.sign(
  { id }, 
  process.env.JWT_SECRET, 
  { expiresIn: '7d' }
);

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body || {};
  try {
    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'name, email, and password are required',
      });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ 
        message: 'Email already registered' 
      });
    }


    if(password.length < 6) {
      return res.status(400).json({ 
        message: "Password must be at least 6 characters"
      })
    }

    const user = await User.create({ name, email, password });
    res.status(201).json({ 
      token: makeToken(user._id), 
      name: user.name, role: 
      user.role 
    });
  } catch (err) {
    res.status(500).json({ 
      message: err.message 
    });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    res.json({ 
      token: makeToken(user._id), 
      name: user.name, 
      role: user.role 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;