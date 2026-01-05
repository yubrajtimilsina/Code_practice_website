import Problem from '../../problems/models/ProblemModel.js';
import DailyChallenge from '../models/DailyChallengeModel.js';
import User from '../../auth/models/UserModels.js';
import { createDailyChallenge, findTodayChallenge, addChallengeCompletion } from '../repository/dailyChallengeRepository.js';


export const generateDailyChallenge = async () => {
  try {

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const existingChallenge = await DailyChallenge.findOne({
      date: today,
      isActive: true
    });


    // Get all challenges from last 30 days to avoid repeats
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentChallenges = await DailyChallenge.find({
      date: { $gte: thirtyDaysAgo }
    }).select('problemId').lean();

    const recentProblemIds = recentChallenges.map(c => c.problemId.toString());

    // Difficulty rotation pattern: Easy -> Medium -> Hard -> Medium -> Easy...
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
    const difficultyPattern = ['Easy', 'Medium', 'Hard', 'Medium'];
    const targetDifficulty = difficultyPattern[dayOfYear % 4];

    // Find a problem that hasn't been used recently
    const problem = await Problem.findOne({
      _id: { $nin: recentProblemIds },
      difficulty: targetDifficulty
    })
      .sort({ views: 1 }) // Prioritize less viewed problems
      .lean();

    if (!problem) {

      const fallbackProblem = await Problem.findOne({
        difficulty: targetDifficulty
      })
        .sort({ views: 1 })
        .lean();

      if (!fallbackProblem) {
        throw new Error('No problems available for daily challenge');
      }

      return await createChallenge(fallbackProblem, today);
    }

    return await createChallenge(problem, today);

  } catch (error) {
    throw error;
  }
};


const createChallenge = async (problem, date) => {
  const expiresAt = new Date(date);
  expiresAt.setDate(expiresAt.getDate() + 1);
  expiresAt.setHours(23, 59, 59, 999);

  const challenge = await createDailyChallenge({
    date,
    problemId: problem._id,
    difficulty: problem.difficulty,
    expiresAt,
    isActive: true
  });


  return challenge;
};


export const getTodayChallenge = async () => {
  let challenge = await findTodayChallenge();

  if (!challenge) {
    // Auto-generate if doesn't exist
    challenge = await generateDailyChallenge();
  }

  return challenge;
};

export const hasUserCompletedToday = async (userId) => {
  const challenge = await findTodayChallenge();

  if (!challenge) {
    return false;
  }

  const completed = challenge.completedBy.find(
    c => c.userId.toString() === userId.toString()
  );

  return !!completed;
};


export const deactivateExpiredChallenges = async () => {
  const now = new Date();

  const result = await DailyChallenge.updateMany(
    {
      expiresAt: { $lt: now },
      isActive: true
    },
    {
      $set: { isActive: false }
    }
  );


  return result;
};

export const processDailyChallengeCompletion = async (userId, submissionId, problemId, executionTime, language) => {
  try {
    const challenge = await getTodayChallenge();

    if (!challenge) return null;

    // Check if the submitted problem matches today's challenge
    if (challenge.problemId._id.toString() !== problemId.toString()) {
      return null;
    }

    // Add completion
    const updatedChallenge = await addChallengeCompletion(
      challenge._id,
      userId,
      submissionId,
      executionTime,
      language
    );

    // Update user's daily challenge stats
    const user = await User.findById(userId);
    if (user) {
      // Check if already updated today to avoid double counting if they submit multiple times
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const lastDate = user.lastDailyChallengeDate ? new Date(user.lastDailyChallengeDate) : null;
      if (lastDate) lastDate.setHours(0, 0, 0, 0);

      if (!lastDate || lastDate.getTime() !== today.getTime()) {
        user.dailyChallengesCompleted = (user.dailyChallengesCompleted || 0) + 1;
        user.lastDailyChallengeDate = new Date();
        await user.save();
      }
    }

    return updatedChallenge;
  } catch (error) {
    console.error('Error processing daily challenge completion:', error);
    // Don't throw, just log. We don't want to fail the submission if daily challenge tracking fails
    return null;
  }
};