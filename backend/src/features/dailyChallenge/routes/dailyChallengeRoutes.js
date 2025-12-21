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

// Public route - Get today's challenge
router.get('/today', authMiddleware, getTodayChallenge);

// Get challenge history
router.get('/history', authMiddleware, getChallengeHistory);

// Get challenge by date
router.get('/date/:date', authMiddleware, getChallengeByDate);

// Get challenge leaderboard
router.get('/leaderboard/:challengeId', authMiddleware, getDailyChallengeLeaderboard);

// Get user's completion history
router.get('/my-history', authMiddleware, getMyHistory);

// Complete challenge (internal - called after submission)
router.post('/complete', authMiddleware, completeDailyChallenge);

// Admin only - Manually generate challenge
router.post('/generate', authMiddleware, role('admin', 'super-admin'), manuallyGenerateChallenge);

export default router;