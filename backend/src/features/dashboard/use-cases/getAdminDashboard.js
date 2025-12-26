import User from "../../auth/models/UserModels.js";
import Problem from "../../problems/models/ProblemModel.js";
import Submission from "../../submissions/models/submissionModel.js";
import DailyChallenge from "../../dailyChallenge/models/DailyChallengeModel.js";

export const getAdminDashboard = async () => {
    // Total users
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
    }, {});

    // Total problems
    const totalProblems = await Problem.countDocuments();
    
    // Problems by difficulty
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

    // Total submissions
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

    // Recent registrations (last 7 days)
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

    // Most popular problems
    const popularProblems = await Submission.aggregate([
        {
            $group: {
                _id: "$problemId",
                submissionCount: { $sum: 1 }
            }
        },
        { $sort: { submissionCount: -1 } },
        { $limit: 5 },
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

    // Daily challenge stats
    const totalDailyChallenges = await DailyChallenge.countDocuments();
    const activeDailyChallenges = await DailyChallenge.countDocuments({ isActive: true });

    // Recent users (last 10)
    const recentUsers = await User.find()
        .select('name email role isActive createdAt')
        .sort({ createdAt: -1 })
        .limit(10)
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
            submissionCount: p.submissionCount
        })),
        recentUsers: recentUsers.map(u => ({
            _id: u._id,
            name: u.name,
            email: u.email,
            role: u.role,
            isActive: u.isActive,
            createdAt: u.createdAt
        })),
        userGrowth: userGrowth.map(g => ({
            date: g._id,
            count: g.count
        }))
    };
};