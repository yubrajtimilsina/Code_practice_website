import User from "../../auth/models/UserModels.js";
import Submission from "../../submissions/models/submissionModel.js";
import Problem from "../../problems/models/ProblemModel.js";
import DailyChallenge from "../../dailyChallenge/models/DailyChallengeModel.js";

export const getLearnerDashboard = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }

   
    const allUsers = await User.find({ isActive: true, role: 'learner' })
        .select('_id rankPoints solvedProblemsCount')
        .sort({ rankPoints: -1, solvedProblemsCount: -1 })
        .lean();
    
    const userRank = allUsers.findIndex(u => u._id.toString() === userId.toString()) + 1;

    // Accuracy = accepted / total
    const accuracy = user.totalSubmissionsCount > 0
        ? ((user.acceptedSubmissionsCount / user.totalSubmissionsCount) * 100).toFixed(2)
        : 0;

    // Streak from user model
    const streak = user.currentStreak || 0;
    const solvedCount = user.solvedProblemsCount || 0;

    // Learning path progress
    const beginnerProgress = Math.min((solvedCount / 5) * 100, 100);
    const intermediateProgress = Math.max(0, Math.min(((solvedCount - 5) / 10) * 100, 100));
    const advancedProgress = Math.max(0, Math.min(((solvedCount - 15) / 20) * 100, 100));

    // Recent submissions (this week)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const recentSubmissions = await Submission.find({
        userId,
        createdAt: { $gte: oneWeekAgo }
    }).countDocuments();

    // Count accepted submissions this week
    const recentAccepted = await Submission.find({
        userId,
        isAccepted: true,
        createdAt: { $gte: oneWeekAgo }
    }).countDocuments();

    // Get recent activity (last 5 submissions)
    const recentActivity = await Submission.find({ userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('problemId', 'title slug difficulty')
        .lean();

    // Daily challenge stats
    const dailyChallengesCompleted = await DailyChallenge.countDocuments({
        'completedBy.userId': userId
    });

    // Get problems by difficulty
    const problemsByDifficulty = {
        easy: user.easyProblemsSolved || 0,
        medium: user.mediumProblemsSolved || 0,
        hard: user.hardProblemsSolved || 0
    };

    // Activity calendar (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const dailyActivity = await Submission.aggregate([
        {
            $match: {
                userId: user._id,
                createdAt: { $gte: thirtyDaysAgo }
            }
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
        message: `Welcome back, ${user.name}!`,
        user: {
            name: user.name,
            email: user.email,
            role: user.role,
            joinedDate: user.createdAt
        },
        stats: {
            solvedProblems: solvedCount,
            submissions: user.totalSubmissionsCount || 0,
            rank: userRank || "Unranked",
            accuracy: Number(accuracy),
            rankPoints: user.rankPoints || 0,
            currentStreak: streak,
            longestStreak: user.longestStreak || 0,
            dailyChallengesCompleted
        },
        learningPath: {
            beginner: { 
                progress: Math.round(beginnerProgress),
                completed: Math.min(solvedCount, 5),
                total: 5
            },
            intermediate: { 
                progress: Math.round(intermediateProgress),
                completed: Math.min(Math.max(solvedCount - 5, 0), 10),
                total: 10
            },
            advanced: { 
                progress: Math.round(advancedProgress),
                completed: Math.min(Math.max(solvedCount - 15, 0), 20),
                total: 20
            }
        },
        thisWeek: {
            problemsSolved: recentAccepted,
            submissions: recentSubmissions,
            streak: streak
        },
        problemsByDifficulty,
        recentActivity: recentActivity.map(sub => ({
            _id: sub._id,
            problemTitle: sub.problemId?.title || 'Unknown',
            problemSlug: sub.problemId?.slug,
            difficulty: sub.problemId?.difficulty,
            verdict: sub.verdict,
            isAccepted: sub.isAccepted,
            language: sub.language,
            createdAt: sub.createdAt
        })),
        activityCalendar: dailyActivity.reduce((acc, day) => {
            acc[day._id] = day.count;
            return acc;
        }, {})
    };
};