import jwt from 'jsonwebtoken';
import User from '../models/user.models.js';

const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ 
      message: 'Unauthorized: No token' 
    })
  };

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    console.log('user: ', user);

    if (!user) {
        return res.status(401).json({ 
          message: 'User not found' 
        });
    }
    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ 
      message: 'forbidden: Admins only' 
    })
  };
  next();
};

export { protect, adminOnly };