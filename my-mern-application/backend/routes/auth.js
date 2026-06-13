import express from 'express';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/me', protect, (req, res) => {
  res.json({ id: req.user.id, name: req.user.name, email: req.user.email });
});

// Called right after Firebase registration to persist the user in MongoDB
router.post('/register', protect, (req, res) => {
  res.status(201).json({ id: req.user.id, name: req.user.name, email: req.user.email });
});

export default router;
