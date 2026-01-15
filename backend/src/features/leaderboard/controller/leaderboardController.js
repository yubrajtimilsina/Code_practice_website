import User from "../../auth/models/UserModels.js";
import Submission from "../../submissions/models/submissionModel.js";
import Problem from "../../problems/models/ProblemModel.js";
import { updateUserStatistics } from "../../submissions/services/submissionService.js";
import { getProblemStatistics } from "../../problems/services/problemService.js";
import SystemSettings from "../../superAdmin/models/SystemSettingsModel.js";

const getDateAgo = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

const getActiveLearners = async (sort) => {
  return await User.find({
    isActive: true,
    role: 'learner'
  })
    .select('_id rankPoints solvedProblemsCount')
    .sort(sort)
    .lean();
};

const calculateAccuracy = (accepted, total) => {
  return total > 0 ? ((accepted / total) * 100).toFixed(2) : "0.00";
};

export const getGlobalLeaderboard = async (req, res) => {
  // Check for contest mode
  const settings = await SystemSettings.findOne();
  if (settings && settings.contestMode && req.user.role === 'learner') {
    return res.status(403).json({
      error: "Contest Mode Active",
      message: "Global leaderboard is temporarily hidden during contests."
    });
  }

  const {
    page = 1,
    limit = 50,
    sortBy = 'rankPoints',
    search = ''
  } = req.query;

  const skip = (page - 1) * limit;

  // Build query
  const query = {
    isActive: true,
    role: 'learner'
  };

  // Add search if provided
  if (search && search.trim()) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }

  // Define sort options
  const sortOptions = {
    rankPoints: { rankPoints: -1, solvedProblemsCount: -1 },
    solved: { solvedProblemsCount: -1, rankPoints: -1 },
    accuracy: { acceptedSubmissionsCount: -1, totalSubmissionsCount: 1 },
    streak: { currentStreak: -1, longestStreak: -1 }
  };

  const sort = sortOptions[sortBy] || sortOptions.rankPoints;

  // Get ALL active learners for correct rank calculation
  const allActiveUsers = await getActiveLearners(sort);

  // Calculate ranks for all users
  const ranksMap = new Map();
  allActiveUsers.forEach((user, index) => {
    ranksMap.set(user._id.toString(), index + 1);
  });

  // Get paginated results with search filter
  const users = await User.find(query)
    .select('name email solvedProblemsCount totalSubmissionsCount acceptedSubmissionsCount rankPoints currentStreak longestStreak easyProblemsSolved mediumProblemsSolved hardProblemsSolved')
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit))
    .lean();

  // Get total count for pagination
  const total = await User.countDocuments(query);

  // Attach correct ranks and ensure all fields exist
  const leaderboard = users.map((user) => {
    // Find user's rank from the complete sorted list
    const userRankIndex = allActiveUsers.findIndex(u => u._id.toString() === user._id.toString());
    const rank = userRankIndex >= 0 ? userRankIndex + 1 : 0;

    return {
      ...user,
      rank,
      accuracy: calculateAccuracy(user.acceptedSubmissionsCount, user.totalSubmissionsCount),
      easyProblemsSolved: user.easyProblemsSolved || 0,
      mediumProblemsSolved: user.mediumProblemsSolved || 0,
      hardProblemsSolved: user.hardProblemsSolved || 0,
      currentStreak: user.currentStreak || 0,
      longestStreak: user.longestStreak || 0
    };
  });

  res.json({
    leaderboard,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  });
};

export const getUserRank = async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId).lean();
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (user.role === 'admin' || user.role === 'super-admin') {
    return res.json({
      userId: user._id,
      rank: null,
      totalUsers: 0,
      percentile: 0,
      rankPoints: user.rankPoints || 0,
      solvedProblems: user.solvedProblemsCount || 0,
      message: "Admins are not ranked in the leaderboard",
      isAdmin: true
    });
  }

  // Calculate rank correctly based on ALL active learners
  const allActiveUsers = await getActiveLearners({ rankPoints: -1, solvedProblemsCount: -1 });

  const userIndex = allActiveUsers.findIndex(u => u._id.toString() === userId.toString());
  const rank = userIndex >= 0 ? userIndex + 1 : null;
  const totalUsers = allActiveUsers.length;

  res.json({
    userId: user._id,
    rank,
    totalUsers,
    percentile: totalUsers > 0 && rank ? (100 - (rank / totalUsers * 100)).toFixed(2) : 0,
    rankPoints: user.rankPoints || 0,
    solvedProblems: user.solvedProblemsCount || 0,
    isAdmin: false
  });
};


export const getUserProgress = async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId).lean();
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const submissions = await Submission.find({ userId })
    .select('verdict language createdAt problemId isAccepted')
    .populate('problemId', 'difficulty')
    .sort({ createdAt: -1 })
    .lean();

  const totalSubmissions = submissions.length;
  const acceptedSubmissions = submissions.filter(s => s.isAccepted).length;

  const solvedProblemIds = new Set(
    submissions.filter(s => s.isAccepted).map(s => s.problemId ? String(s.problemId._id || s.problemId) : null).filter(Boolean)
  );
  const solvedProblems = solvedProblemIds.size;

  const accuracy = calculateAccuracy(acceptedSubmissions, totalSubmissions);

  const languageStats = {};
  const verdictStats = {};
  submissions.forEach(sub => {
    if (sub.language) languageStats[sub.language] = (languageStats[sub.language] || 0) + 1;
    const v = sub.verdict || "Unknown";
    verdictStats[v] = (verdictStats[v] || 0) + 1;
  });

  const problemsByDifficulty = { easy: 0, medium: 0, hard: 0 };
  submissions.forEach(sub => {
    if (sub.isAccepted && sub.problemId && sub.problemId.difficulty) {
      const d = (sub.problemId.difficulty || "").toLowerCase();
      if (d.includes('easy')) problemsByDifficulty.easy++;
      else if (d.includes('medium')) problemsByDifficulty.medium++;
      else if (d.includes('hard')) problemsByDifficulty.hard++;
    }
  });

  const thirtyDaysAgo = getDateAgo(30);
  const last30 = submissions.filter(s => new Date(s.createdAt) > thirtyDaysAgo);
  const recentActivity = {
    last30Days: last30.length,
    submissions: last30.slice(0, 50)
  };

  const ninetyDaysAgo = getDateAgo(90);
  const activityCalendar = {};
  submissions
    .filter(s => new Date(s.createdAt) > ninetyDaysAgo)
    .forEach(s => {
      const date = new Date(s.createdAt).toISOString().split('T')[0];
      activityCalendar[date] = (activityCalendar[date] || 0) + 1;
    });

  const normalizedUser = {
    id: user._id,
    name: user.name,
    email: user.email,
    solvedProblems: user.solvedProblemsCount ?? solvedProblems,
    acceptedSubmissions: user.acceptedSubmissionsCount ?? acceptedSubmissions,
    totalSubmissions: user.totalSubmissionsCount ?? totalSubmissions,
    accuracy: accuracy,
    rankPoints: user.rankPoints ?? 0,
    currentStreak: user.currentStreak ?? 0,
    longestStreak: user.longestStreak ?? 0,
  };

  return res.json({
    user: normalizedUser,
    problemsByDifficulty,
    languageStats,
    verdictStats,
    recentActivity,
    activityCalendar
  });
};
