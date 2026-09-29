import {Router} from 'express';
import { createGroupHandler, getGroupMembersHandler, getPendingRequestsHandler, joinGroupHandler, respondToRequestHandler } from '../controllers/group.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/create', authenticate, createGroupHandler);
router.post('/join', authenticate, joinGroupHandler);

// Add these routes to your existing group router
router.get('/requests/pending', authenticate, getPendingRequestsHandler);
router.patch('/requests/:requestId/respond', authenticate, respondToRequestHandler);

router.get('/:groupId/members', authenticate, getGroupMembersHandler);

export default router;