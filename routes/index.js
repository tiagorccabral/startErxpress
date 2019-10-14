import express from 'express';
import authRoutes from './auth'

// Declares main router of App
const router = express.Router();

// Public routes
router.use('/auth', authRoutes);

export default router;