import User from "../../auth/models/UserModels.js";
import Problem from "../../problems/models/ProblemModel.js";
import Submission from "../../submissions/models/submissionModel.js";
import DailyChallenge from "../../dailyChallenge/models/DailyChallengeModel.js";

export const getAdminDashboard = async () => {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const inactiveUsers = totalUsers - activeUsers;

    const usersByRole = await User.aggregate([
        {
            $group: {
                _id: "$role",
                count: { $sum: 1 }
            }
        }
    ]);

    const roleStats = usersByRole.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
    }, { learner: 0, admin: 0, "super-admin": 0 });

    // Total problems with difficulty breakdown
    const totalProblems = await Problem.countDocuments();
    
    const problemsByDifficulty = await Problem.aggregate([
        {
            $group: {
                _id: "$difficulty",
                count: { $sum: 1 }
            }
        }
    ]);

    const difficultyStats = problemsByDifficulty.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
    }, { Easy: 0, Medium: 0, Hard: 0 });

    // Submission statistics
    const totalSubmissions = await Submission.countDocuments();
    const acceptedSubmissions = await Submission.countDocuments({ isAccepted: true });
    const accuracyRate = totalSubmissions > 0 
        ? ((acceptedSubmissions / totalSubmissions) * 100).toFixed(2)
        : 0;

    // Submissions by verdict
    const submissionsByVerdict = await Submission.aggregate([
        {
            $group: {
                _id: "$verdict",
                count: { $sum: 1 }
            }
        },
        { $sort: { count: -1 } }
    ]);

    // Recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentRegistrations = await User.countDocuments({
        createdAt: { $gte: sevenDaysAgo }
    });

    // Recent submissions (last 24 hours)
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    const recentSubmissions = await Submission.countDocuments({
        createdAt: { $gte: oneDayAgo }
    });

    // Most popular problems (top 10)
    const popularProblems = await Submission.aggregate([
        {
            $group: {
                _id: "$problemId",
                submissionCount: { $sum: 1 },
                acceptedCount: { 
                    $sum: { $cond: ["$isAccepted", 1, 0] }
                }
            }
        },
        { $sort: { submissionCount: -1 } },
        { $limit: 10 },
        {
            $lookup: {
                from: "problems",
                localField: "_id",
                foreignField: "_id",
                as: "problem"
            }
        },
        { $unwind: "$problem" }
    ]);

    // Daily challenge statistics
    const totalDailyChallenges = await DailyChallenge.countDocuments();
    const activeDailyChallenges = await DailyChallenge.countDocuments({ isActive: true });

    // Recent users (last 20 for table display)
    const recentUsers = await User.find()
        .select('name email role isActive createdAt solvedProblemsCount totalSubmissionsCount')
        .sort({ createdAt: -1 })
        .limit(20)
        .lean();

    // Platform growth (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const userGrowth = await User.aggregate([
        {
            $match: { createdAt: { $gte: thirtyDaysAgo } }
        },
        {
            $group: {
                _id: {
                    $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                },
                count: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    const submissionTrends = await Submission.aggregate([
        {
            $match: { createdAt: { $gte: thirtyDaysAgo } }
        },
        {
            $group: {
                _id: {
                    $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                },
                total: { $sum: 1 },
                accepted: { 
                    $sum: { $cond: ["$isAccepted", 1, 0] }
                }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    // Language statistics
    const languageStats = await Submission.aggregate([
        {
            $group: {
                _id: "$language",
                count: { $sum: 1 }
            }
        },
        { $sort: { count: -1 } },
        { $limit: 10 }
    ]);

    return {
        message: "Admin Dashboard Data",
        stats: {
            totalUsers,
            activeUsers,
            inactiveUsers,
            totalProblems,
            totalSubmissions,
            acceptedSubmissions,
            accuracyRate: Number(accuracyRate),
            recentRegistrations,
            recentSubmissions,
            totalDailyChallenges,
            activeDailyChallenges
        },
        usersByRole: roleStats,
        problemsByDifficulty: difficultyStats,
        submissionsByVerdict: submissionsByVerdict.map(s => ({
            verdict: s._id,
            count: s.count
        })),
        popularProblems: popularProblems.map(p => ({
            _id: p.problem._id,
            title: p.problem.title,
            difficulty: p.problem.difficulty,
            submissionCount: p.submissionCount,
            acceptedCount: p.acceptedCount,
            acceptanceRate: p.submissionCount > 0 
                ? ((p.acceptedCount / p.submissionCount) * 100).toFixed(2)
                : 0
        })),
        recentUsers: recentUsers.map(u => ({
            _id: u._id,
            name: u.name,
            email: u.email,
            role: u.role,
            isActive: u.isActive,
            createdAt: u.createdAt,
            solvedProblemsCount: u.solvedProblemsCount || 0,
            totalSubmissionsCount: u.totalSubmissionsCount || 0
        })),
        userGrowth: userGrowth.map(g => ({
            date: g._id,
            count: g.count
        })),
        submissionTrends: submissionTrends.map(s => ({
            date: s._id,
            total: s.total,
            accepted: s.accepted,
            acceptanceRate: s.total > 0 
                ? ((s.accepted / s.total) * 100).toFixed(2)
                : 0
        })),
        languageStats: languageStats.map(l => ({
            language: l._id,
            count: l.count
        }))
    };
};