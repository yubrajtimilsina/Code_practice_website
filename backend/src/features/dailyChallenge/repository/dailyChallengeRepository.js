import DailyChallenge from '../models/DailyChallengeModel.js';

export const createDailyChallenge = async (challengeData) => {
  const challenge = new DailyChallenge(challengeData);
  return await challenge.save();
};

export const findTodayChallenge = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return await DailyChallenge.findOne({
    date: { $gte: today, $lt: tomorrow },
    isActive: true
  })
    .populate('problemId')
    .populate('completedBy.userId', 'name email')
    .lean();
};

export const findChallengeByDate = async (date) => {
  return await DailyChallenge.findOne({ date })
    .populate('problemId')
    .populate('completedBy.userId', 'name email')
    .lean();
};

export const findAllChallenges = async (limit = 30) => {
  return await DailyChallenge.find()
    .sort({ date: -1 })
    .limit(limit)
    .populate('problemId', 'title difficulty tags')
    .lean();
};

export const addChallengeCompletion = async (challengeId, userId, submissionId, executionTime, language) => {
  const challenge = await DailyChallenge.findById(challengeId);
  
  if (!challenge) {
    throw new Error('Challenge not found');
  }
  
  const alreadyCompleted = challenge.completedBy.find(
    c => c.userId.toString() === userId.toString()
  );
  
  if (alreadyCompleted) {
  
    alreadyCompleted.attempts += 1;
  } else {
    // Add new completion
    challenge.completedBy.push({
      userId,
      completedAt: new Date(),
      submissionId,
      attempts: 1
    });
    
    challenge.totalCompletions += 1;
    
    challenge.leaderboard.push({
      userId,
      completedAt: new Date(),
      executionTime,
      language,
      rank: challenge.leaderboard.length + 1
    });
    
    // Sort leaderboard by completion time
    challenge.leaderboard.sort((a, b) => new Date(a.completedAt) - new Date(b.completedAt));
    
    challenge.leaderboard.forEach((entry, index) => {
      entry.rank = index + 1;
    });
  }
  
  challenge.totalAttempts += 1;
  
  return await challenge.save();
};

export const incrementChallengeAttempt = async (challengeId) => {
  return await DailyChallenge.findByIdAndUpdate(
    challengeId,
    { $inc: { totalAttempts: 1 } },
    { new: true }
  );
};

export const getChallengeLeaderboard = async (challengeId) => {
  const challenge = await DailyChallenge.findById(challengeId)
    .populate('leaderboard.userId', 'name email')
    .lean();
  
  return challenge?.leaderboard || [];
};

export const getUserChallengeHistory = async (userId, limit = 30) => {
  return await DailyChallenge.find({
    'completedBy.userId': userId
  })
    .sort({ date: -1 })
    .limit(limit)
    .populate('problemId', 'title difficulty tags')
    .lean();
};