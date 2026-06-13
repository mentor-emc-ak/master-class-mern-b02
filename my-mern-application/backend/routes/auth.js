import express from 'express';
import { protect } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

router.get('/me', protect, (req, res) => {
  res.json({ id: req.user.id, name: req.user.name, email: req.user.email });
});

router.post('/register', async (req, res) => {
  try {
    // Check if user already exists in MongoDB
    const existingUser = await User.findOne({ firebaseUid: req.user.uid });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user in MongoDB
    const newUser = new User({
      firebaseUid: req.user.uid,
      name: req.user.name,
      email: req.user.email,
    });
    await newUser.save();
    res.status(201).json({ id: newUser._id, name: newUser.name, email: newUser.email });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
