import { Router } from 'express';
import { authMiddleware } from '../../../middlewares/authMiddleware.js';
import { role } from '../../../middlewares/roleMiddleware.js';
import { createDiscussion, getAllDiscussions, getDiscussionById, updateDiscussion, deleteDiscussion, voteDiscussion,
    addComment, updateComment, deleteComment, voteComment, pinDiscussion
 } from '../controller/discussionController.js';

const router = Router();

router.get('/', getAllDiscussions);
router.get('/:id', getDiscussionById);

router.post('/', authMiddleware, createDiscussion);
router.put('/:id', authMiddleware, updateDiscussion);
router.delete('/:id', authMiddleware, role('admin', 'super-admin'), deleteDiscussion);
router.post('/:id/vote', authMiddleware, voteDiscussion);


router.post('/:id/comments', authMiddleware, addComment);
router.put('/:id/comments/:commentId', authMiddleware, updateComment);
router.delete('/:id/comments/:commentId', authMiddleware, deleteComment);
router.post('/:id/comments/:commentId/vote', authMiddleware, voteComment);

// Admin only
router.post('/:id/pin', authMiddleware, role('admin', 'super-admin'), pinDiscussion);

 
export default router;