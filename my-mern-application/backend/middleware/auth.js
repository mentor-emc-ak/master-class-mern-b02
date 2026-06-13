import admin from '../config/firebase.js';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized' });
  }
  try {
    const token = authHeader.split(' ')[1];
    const decoded = await admin.auth().verifyIdToken(token);

    let user = await User.findOne({ firebaseUid: decoded.uid });
    if (!user) {
      user = await User.create({
        firebaseUid: decoded.uid,
        email: decoded.email,
        name: decoded.name || decoded.email,
      });
    } else if (decoded.name && user.name !== decoded.name) {
      user.name = decoded.name;
      await user.save();
    }

    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};
