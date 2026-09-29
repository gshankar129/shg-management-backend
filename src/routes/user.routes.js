import express from 'express';
import { getMyProfileHandler } from '../controllers/user.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// GET /api/users/me
router.get('/me', authenticate, getMyProfileHandler );

export default router;