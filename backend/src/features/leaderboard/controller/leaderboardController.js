import User from "../../auth/models/UserModels.js";
import Submission from "../../submissions/models/submissionModel.js";
import Problem from "../../problems/models/ProblemModel.js";

export const getGlobalLeaderboard = async (req, res) => {
    try {
        const { page = 1, limit = 50, sortBy = 'rankPoints' } = req.query;
        const skip = (page - 1) * limit;

        const sortOptions = {
            rankPoints: { rankPoints: -1, solvedProblemsCount: -1 },
            solved: { solvedProblemsCount: -1, rankPoints: -1 },
            accuracy: { acceptedSubmissionsCount: -1, totalSubmissionsCount: 1 },
            streak: { currentStreak: -1, longestStreak: -1 }
        };

         const sort = sortOptions[sortBy] || sortOptions.rankPoints;
    
    const users = await User.find({ 
      isActive: true,
      solvedProblemsCount: { $gt: 0 } 
    })
      .select('name email solvedProblemsCount totalSubmissionsCount acceptedSubmissionsCount rankPoints currentStreak longestStreak easyProblemsSolved mediumProblemsSolved hardProblemsSolved')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();
    
    const total = await User.countDocuments({ 
      isActive: true,
      solvedProblemsCount: { $gt: 0 }
    });

     const leaderboard = users.map((user, index) => ({
      ...user,
      rank: skip + index + 1,
      accuracy: user.totalSubmissionsCount > 0 
        ? ((user.acceptedSubmissionsCount / user.totalSubmissionsCount) * 100).toFixed(2)
        : 0
    }));
    
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
};

export const getUserRank = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const user = await User.findById(userId).lean();
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    const rank = await User.countDocuments({
      isActive: true,
      rankPoints: { $gt: user.rankPoints }
    }) + 1;
    
    // Get total active users
    const totalUsers = await User.countDocuments({
      isActive: true,
      solvedProblemsCount: { $gt: 0 }
    });
    
    res.json({
      rank,
      totalUsers,
      percentile: totalUsers > 0 ? (100 - (rank / totalUsers * 100)).toFixed(2) : 0,
      rankPoints: user.rankPoints,
      solvedProblems: user.solvedProblemsCount
    });
  } catch (error) {
    console.error("Get user rank error:", error);
    res.status(500).json({ error: "Failed to fetch user rank" });
  }
};

export const getUserProgress = async ( req, res) => {
    try{
        const userId = req.user._id;

        const user = await User.findById(userId).lean();
        if (!user) {
            return res.status(404).json({ error: "User not found"});
        }

         const submissions = await Submission.find({ userId })
      .select('verdict language createdAt problemId')
      .populate('problemId', 'difficulty')
      .sort({ createdAt: -1 })
      .lean();

      const languageStats = {};
    submissions.forEach(sub => {
      languageStats[sub.language] = (languageStats[sub.language] || 0) + 1;
    });

     const verdictStats = {};
    submissions.forEach(sub => {
      verdictStats[sub.verdict] = (verdictStats[sub.verdict] || 0) + 1;
    });

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentSubmissions = submissions.filter(
      sub => new Date(sub.createdAt) > thirtyDaysAgo
    );

     const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    const activityData = {};
    submissions
      .filter(sub => new Date(sub.createdAt) > ninetyDaysAgo)
      .forEach(sub => {
        const date = new Date(sub.createdAt).toISOString().split('T')[0];
        activityData[date] = (activityData[date] || 0) + 1;
      });
    
    res.json({
      user: {
        name: user.name,
        email: user.email,
        solvedProblems: user.solvedProblemsCount,
        totalSubmissions: user.totalSubmissionsCount,
        acceptedSubmissions: user.acceptedSubmissionsCount,
        accuracy: user.totalSubmissionsCount > 0 
          ? ((user.acceptedSubmissionsCount / user.totalSubmissionsCount) * 100).toFixed(2)
          : 0,
        rankPoints: user.rankPoints,
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak
      },
      problemsByDifficulty: {
        easy: user.easyProblemsSolved,
        medium: user.mediumProblemsSolved,
        hard: user.hardProblemsSolved
      },
      languageStats,
      verdictStats,
      recentActivity: {
        last30Days: recentSubmissions.length,
        submissions: recentSubmissions.slice(0, 10)
      },
      activityCalendar: activityData
    });
  } catch (error) {
    console.error("Get user progress error:", error);
    res.status(500).json({ error: "Failed to fetch user progress" });
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
    
    // Language distribution
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
    
    // Unique solvers
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
    
    // Database health
    const dbHealth = {
      status: 'healthy',
      collections: {
        users: totalUsers,
        problems: totalProblems,
        submissions: totalSubmissions
      }
    };
    
    // System metrics
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