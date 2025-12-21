import DailyChallenge from '../models/DailyChallengeModel.js';

export const createDailyChallenge = async (challengeData) => {
  const challenge = new DailyChallenge(challengeData);
  return await challenge.save();
};

export const findTodayChallenge = async () => {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return await DailyChallenge.findOne({
    date: { $gte: today, $lt: tomorrow },
    isActive: true
  })
    .populate({
      path: 'problemId',
      select: 'title description difficulty tags examples constraints sampleInput sampleOutput timeLimitSec memoryLimitMB'
    })
    .populate('completedBy.userId', 'name email')
    .populate('leaderboard.userId', 'name email')
    .exec();
};

export const findChallengeByDate = async (date) => {
  return await DailyChallenge.findOne({ date })
    .populate({
      path: 'problemId',
      select: 'title description difficulty tags examples constraints sampleInput sampleOutput timeLimitSec memoryLimitMB'
    })
    .populate('completedBy.userId', 'name email')
    .populate('leaderboard.userId', 'name email')
    .exec();
};

export const findAllChallenges = async (limit = 30) => {
  return await DailyChallenge.find()
    .sort({ date: -1 })
    .limit(limit)
    .populate({
      path: 'problemId',
      select: 'title difficulty tags description'
    })
    .exec();
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
    .exec();
  
  if (!challenge) {
    return [];
  }
  
  return challenge.leaderboard.map(entry => ({
    userId: {
      _id: entry.userId?._id,
      name: entry.userId?.name,
      email: entry.userId?.email
    },
    rank: entry.rank,
    completedAt: entry.completedAt,
    executionTime: entry.executionTime,
    language: entry.language
  }));
};

export const getUserChallengeHistory = async (userId, limit = 30) => {
  console.log(' Repository: Getting challenge history for user:', userId);
  
  const query = DailyChallenge.find({
    'completedBy.userId': userId
  })
    .sort({ date: -1 })
    .limit(limit)
    .populate({
      path: 'problemId',
      select: 'title difficulty tags description'
    })
    .populate('completedBy.userId', 'name email')
    .populate('leaderboard.userId', 'name email');
  
  console.log(' Query filter:', { 'completedBy.userId': userId });
  console.log(' Query limit:', limit);
  
  const results = await query.exec();
  
  console.log(' Query returned:', results.length, 'documents');
  
  if (results.length === 0) {
    console.log(' Query found NO results. Checking if any challenges exist at all...');
    const totalChallenges = await DailyChallenge.countDocuments();
    console.log(' Total challenges in DB:', totalChallenges);
    
    const challengesWithCompletions = await DailyChallenge.countDocuments({
      'completedBy.userId': userId
    });
    console.log(' Challenges with this user:', challengesWithCompletions);
  }
  
  return results;
};