import DailyChallenge from '../models/DailyChallengeModel.js';

const populateChallengeDetails = (query) => {
  return query
    .populate({
      path: 'problemId',
      select: 'title description difficulty tags examples constraints sampleInput sampleOutput timeLimitSec memoryLimitMB'
    })
    .populate('completedBy.userId', 'name email')
    .populate('leaderboard.userId', 'name email');
};

export const createDailyChallenge = async (challengeData) => {
  const challenge = new DailyChallenge(challengeData);
  return await challenge.save();
};

export const findTodayChallenge = async () => {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return await populateChallengeDetails(DailyChallenge.findOne({
    date: { $gte: today, $lt: tomorrow },
    isActive: true
  })).exec();
};

export const findChallengeByDate = async (date) => {
  return await populateChallengeDetails(DailyChallenge.findOne({ date })).exec();
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

export const getUserChallengeHistory = async (userId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const countQuery = DailyChallenge.countDocuments({
    'completedBy.userId': userId
  });

  const dataQuery = DailyChallenge.find({
    'completedBy.userId': userId
  })
    .sort({ date: -1 })
    .skip(skip)
    .limit(limit)
    .populate({
      path: 'problemId',
      select: 'title difficulty tags description'
    })
    .populate('completedBy.userId', 'name email')
    .populate('leaderboard.userId', 'name email');

  const [total, challenges] = await Promise.all([countQuery.exec(), dataQuery.exec()]);

  return { challenges, total };
};

export const getUserCompletionDates = async (userId) => {
  const challenges = await DailyChallenge.find({
    'completedBy.userId': userId
  })
    .select('date')
    .sort({ date: 1 })
    .lean();

  return challenges.map(c => c.date);
};