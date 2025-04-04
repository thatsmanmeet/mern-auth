import express from 'express';
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
} from '../controllers/user.controller.js';
import { authMiddleware } from '../middleware/auth.middelware.js';

const router = express.Router();

router.post('/auth', authUser);
router.post('/register', registerUser);
router.post('/logout', logoutUser);
router
  .route('/profile')
  .get(authMiddleware, getUserProfile)
  .put(authMiddleware, updateUserProfile);

export default router;
