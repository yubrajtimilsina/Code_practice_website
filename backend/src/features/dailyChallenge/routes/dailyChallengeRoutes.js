import { Router } from 'express';
import { authMiddleware } from '../../../middlewares/authMiddleware.js';
import { role } from '../../../middlewares/roleMiddleware.js';
import {
  getTodayChallenge,
  getChallengeHistory,
  getChallengeByDate,
  getDailyChallengeLeaderboard,
  getMyHistory,
  completeDailyChallenge,
  manuallyGenerateChallenge
} from '../controller/dailyChallengeController.js';

const router = Router();


router.get('/today', authMiddleware, getTodayChallenge);

router.get('/history', authMiddleware, getChallengeHistory);


router.get('/date/:date', authMiddleware, getChallengeByDate);

// Get challenge leaderboard
router.get('/leaderboard/:challengeId', authMiddleware, getDailyChallengeLeaderboard);

router.get('/my-history', authMiddleware, getMyHistory);

router.post('/complete', authMiddleware, completeDailyChallenge);

// Admin only - Manually generate challenge
router.post('/generate', authMiddleware, role('admin', 'super-admin'), manuallyGenerateChallenge);

export default router;