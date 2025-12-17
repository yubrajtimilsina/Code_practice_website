import User from "../../auth/models/UserModels.js";
import Submission from "../../submissions/models/submissionModel.js";
import Problem from "../../problems/models/ProblemModel.js";

export const getGlobalLeaderboard = async (req, res) => {
  try {
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
    const allActiveUsers = await User.find({
      isActive: true,
      role: 'learner'
    })
      .select('_id rankPoints solvedProblemsCount')
      .sort(sort)
      .lean();
    
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
        accuracy: user.totalSubmissionsCount > 0 
          ? ((user.acceptedSubmissionsCount / user.totalSubmissionsCount) * 100).toFixed(2)
          : '0.00',
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
  } catch (error) {
    console.error("Get leaderboard error:", error);
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
}

export const getUserRank = async (req, res) => {
  try {
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
    const allActiveUsers = await User.find({
      isActive: true,
      role: 'learner'
    })
      .select('_id rankPoints solvedProblemsCount')
      .sort({ rankPoints: -1, solvedProblemsCount: -1 })
      .lean();
    
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
  } catch (error) {
    console.error("Get user rank error:", error);
    res.status(500).json({ error: "Failed to fetch user rank" });
  }
};


export const getUserProgress = async (req, res) => {
  try{
    const userId = req.user._id;

    const user = await User.findById(userId).lean();
    if (!user) {
      return res.status(404).json({ error: "User not found"});
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

    const accuracy = totalSubmissions > 0 
      ? ((acceptedSubmissions / totalSubmissions) * 100).toFixed(2) 
      : "0.00";

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

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const last30 = submissions.filter(s => new Date(s.createdAt) > thirtyDaysAgo);
    const recentActivity = {
      last30Days: last30.length,
      submissions: last30.slice(0, 50)
    };

    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
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
  } catch (error) {
    console.error("Get user progress error:", error);
    res.status(500).json({ error: "Failed to fetch user progress" });
  }
};


async function updateUserStatistics(userId, problemId, isAccepted, submissionId) {
    try {
        const user = await User.findById(userId);
        const problem = await Problem.findById(problemId);

        if (!user) {
            console.error('User not found:', userId);
            return;
        }

        if (user.role === 'admin' || user.role === 'super-admin') {
            console.log(' Admin detected - Skipping stats update');
            return;
        }

        user.totalSubmissionsCount = (user.totalSubmissionsCount || 0) + 1;

        if (isAccepted) {
            // Increment accepted submissions
            user.acceptedSubmissionsCount = (user.acceptedSubmissionsCount || 0) + 1;

            // Check if this is the FIRST accepted solution for this problem
            const previousAccepted = await Submission.findOne({
                userId,
                problemId,
                isAccepted: true,
                _id: { $ne: submissionId },
            });

            if (!previousAccepted && problem) {
                console.log(' First accepted solution for this problem!');
                user.solvedProblemsCount = (user.solvedProblemsCount || 0) + 1;

                const difficulty = (problem.difficulty || '').toLowerCase();
                if (difficulty.includes('easy')) {
                    user.easyProblemsSolved = (user.easyProblemsSolved || 0) + 1;
                } else if (difficulty.includes('medium')) {
                    user.mediumProblemsSolved = (user.mediumProblemsSolved || 0) + 1;
                } else if (difficulty.includes('hard')) {
                    user.hardProblemsSolved = (user.hardProblemsSolved || 0) + 1;
                }

                // Recalculate rank points: Easy=10, Medium=25, Hard=50
                user.rankPoints = (user.easyProblemsSolved * 10) + 
                                 (user.mediumProblemsSolved * 25) + 
                                 (user.hardProblemsSolved * 50);
                
                console.log('Updated difficulty counts:', {
                    easy: user.easyProblemsSolved,
                    medium: user.mediumProblemsSolved,
                    hard: user.hardProblemsSolved,
                    rankPoints: user.rankPoints
                });
            }

            const now = new Date();
            const lastDate = user.lastSubmissionDate;
            
            if (!lastDate) {
                user.currentStreak = 1;
                user.longestStreak = 1;
            } else {
                const daysDiff = Math.floor((now - lastDate) / (1000 * 60 * 60 * 24));
                
                if (daysDiff === 0) {
                    // Same day - no streak change
                } else if (daysDiff === 1) {
                    // Consecutive day - increment streak
                    user.currentStreak = (user.currentStreak || 0) + 1;
                    user.longestStreak = Math.max(user.longestStreak || 0, user.currentStreak);
                } else {
                    // Gap in streak - reset
                    user.currentStreak = 1;
                }
            }
            
            user.lastSubmissionDate = now;
        }

        user.lastActiveDate = new Date();

        await user.save();

        console.log(' User stats updated:', {
            totalSubmissions: user.totalSubmissionsCount,
            acceptedSubmissions: user.acceptedSubmissionsCount,
            solvedProblems: user.solvedProblemsCount,
            rankPoints: user.rankPoints,
            currentStreak: user.currentStreak,
            longestStreak: user.longestStreak
        });

    } catch (error) {
        console.error(' Error updating user stats:', error);
    }
};


export const getProblemStatistics = async (req, res) => {
  try {
    const { problemId } = req.params;
    
    const problem = await Problem.findById(problemId).lean();
    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }
    
    const submissions = await Submission.find({ problemId })
      .select('verdict language executionTime memoryUsed userId createdAt')
      .lean();
    
    const stats = {
      totalSubmissions: submissions.length,
      acceptedSubmissions: submissions.filter(s => s.verdict === 'Accepted').length,
      wrongAnswers: submissions.filter(s => s.verdict === 'Wrong Answer').length,
      timeoutErrors: submissions.filter(s => s.verdict === 'Time Limit Exceeded').length,
      runtimeErrors: submissions.filter(s => s.verdict.includes('Runtime Error')).length,
      compilationErrors: submissions.filter(s => s.verdict === 'Compilation Error').length
    };
    
    stats.acceptanceRate = stats.totalSubmissions > 0
      ? ((stats.acceptedSubmissions / stats.totalSubmissions) * 100).toFixed(2)
      : 0;
    
    const languageStats = {};
    submissions.forEach(sub => {
      languageStats[sub.language] = (languageStats[sub.language] || 0) + 1;
    });
    
    const acceptedSolutions = submissions.filter(s => s.verdict === 'Accepted' && s.executionTime);
    const avgExecutionTime = acceptedSolutions.length > 0
      ? (acceptedSolutions.reduce((sum, s) => {
          const time = parseFloat(s.executionTime.replace('ms', ''));
          return sum + (isNaN(time) ? 0 : time);
        }, 0) / acceptedSolutions.length).toFixed(2)
      : 0;
    
    const uniqueSolvers = new Set(
      submissions.filter(s => s.verdict === 'Accepted').map(s => s.userId.toString())
    ).size;
    
    res.json({
      problem: {
        title: problem.title,
        difficulty: problem.difficulty,
        tags: problem.tags
      },
      stats,
      languageStats,
      avgExecutionTime: `${avgExecutionTime}ms`,
      uniqueSolvers,
      recentSubmissions: submissions.slice(0, 20)
    });
  } catch (error) {
    console.error("Get problem statistics error:", error);
    res.status(500).json({ error: "Failed to fetch problem statistics" });
  }
};


export const getSystemHealth = async (req, res) => {
  try {
    const [
      totalUsers,
      activeUsers,
      totalProblems,
      totalSubmissions,
      recentSubmissions
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true, lastActiveDate: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } }),
      Problem.countDocuments(),
      Submission.countDocuments(),
      Submission.countDocuments({ createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } })
    ]);
    
    const dbHealth = {
      status: 'healthy',
      collections: {
        users: totalUsers,
        problems: totalProblems,
        submissions: totalSubmissions
      }
    };
    
    const systemMetrics = {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cpu: process.cpuUsage()
    };
    
    res.json({
      status: 'operational',
      timestamp: new Date().toISOString(),
      statistics: {
        totalUsers,
        activeUsers,
        totalProblems,
        totalSubmissions,
        submissionsLast24h: recentSubmissions
      },
      database: dbHealth,
      system: systemMetrics
    });
  } catch (error) {
    console.error("Get system health error:", error);
    res.status(500).json({ 
      status: 'error',
      error: "Failed to fetch system health" 
    });
  }
};