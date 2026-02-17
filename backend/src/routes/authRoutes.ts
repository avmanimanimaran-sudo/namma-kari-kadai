import express from 'express';
import { signup, login, logout, refresh, getUserProfile } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh', refresh);
router.get('/profile', protect, getUserProfile);

export default router;
