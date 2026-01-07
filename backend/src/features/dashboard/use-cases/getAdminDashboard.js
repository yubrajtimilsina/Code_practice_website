import User from "../../auth/models/UserModels.js";
import Problem from "../../problems/models/ProblemModel.js";
import Submission from "../../submissions/models/submissionModel.js";
import DailyChallenge from "../../dailyChallenge/models/DailyChallengeModel.js";

export const getAdminDashboard = async () => {
    try {
        const [
            totalUsers,
            activeUsers,
            usersByRole,
            totalProblems,
            problemsByDifficulty,
            totalSubmissions,
            acceptedSubmissions,
            submissionsByVerdict,
            totalDailyChallenges,
            activeDailyChallenges,
            languageStats
        ] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ isActive: true }),
            User.aggregate([
                { $group: { _id: "$role", count: { $sum: 1 } } }
            ]),
            Problem.countDocuments(),
            Problem.aggregate([
                { $group: { _id: "$difficulty", count: { $sum: 1 } } }
            ]),
            Submission.countDocuments(),
            Submission.countDocuments({ isAccepted: true }),
            Submission.aggregate([
                { $group: { _id: "$verdict", count: { $sum: 1 } } },
                { $sort: { count: -1 } }
            ]),
            DailyChallenge.countDocuments(),
            DailyChallenge.countDocuments({ isActive: true }),
            Submission.aggregate([
                { $group: { _id: "$language", count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 10 }
            ])
        ]);

        const roleStats = usersByRole.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
        }, { learner: 0, admin: 0, "super-admin": 0 });

        const difficultyStats = problemsByDifficulty.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
        }, { Easy: 0, Medium: 0, Hard: 0 });

        const accuracyRate = totalSubmissions > 0
            ? ((acceptedSubmissions / totalSubmissions) * 100).toFixed(2)
            : 0;

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const oneDayAgo = new Date();
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const [
            recentRegistrations,
            recentSubmissions,
            popularProblems,
            recentUsers,
            userGrowth,
            submissionTrends
        ] = await Promise.all([
            User.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
            Submission.countDocuments({ createdAt: { $gte: oneDayAgo } }),
            Submission.aggregate([
                { $group: { _id: "$problemId", submissionCount: { $sum: 1 }, acceptedCount: { $sum: { $cond: ["$isAccepted", 1, 0] } } } },
                { $sort: { submissionCount: -1 } },
                { $limit: 10 },
                { $lookup: { from: "problems", localField: "_id", foreignField: "_id", as: "problem" } },
                { $unwind: "$problem" }
            ]),
            User.find()
                .select('name email role isActive createdAt solvedProblemsCount totalSubmissionsCount')
                .sort({ createdAt: -1 })
                .limit(20)
                .lean(),
            User.aggregate([
                { $match: { createdAt: { $gte: thirtyDaysAgo } } },
                { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
                { $sort: { _id: 1 } }
            ]),
            Submission.aggregate([
                { $match: { createdAt: { $gte: thirtyDaysAgo } } },
                { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, total: { $sum: 1 }, accepted: { $sum: { $cond: ["$isAccepted", 1, 0] } } } },
                { $sort: { _id: 1 } }
            ])
        ]);

        return {
            message: "Admin Dashboard Data",
            stats: {
                totalUsers,
                activeUsers,
                inactiveUsers: totalUsers - activeUsers,
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
    } catch (error) {
        console.error("Admin Dashboard Logic Error:", error);
        throw new Error("Failed to process admin dashboard statistics");
    }
};
