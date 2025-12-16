import User from "../../auth/models/UserModels.js";

export const getLearnerDashboard = async(userId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }

    // Calculate rank: sort by rankPoints DESC
    const allUsers = await User.find({ isActive: true, role: 'learner' })
      .select('_id rankPoints solvedProblemsCount')
      .sort({ rankPoints: -1, solvedProblemsCount: -1 })
      .lean();
    
    const userRank = allUsers.findIndex(u => u._id.toString() === userId.toString()) + 1;

    // ✅ FIXED: Accuracy = accepted / total (NOT solved / total)
    const accuracy = user.totalSubmissionsCount > 0
        ? ((user.acceptedSubmissionsCount / user.totalSubmissionsCount) * 100).toFixed(2)
        : 0;

    // Streak from user model (already updated on acceptance)
    const streak = user.currentStreak || 0;

    const solvedCount = user.solvedProblemsCount || 0;

    // Learning path progress
    const beginnerProgress = Math.min((solvedCount / 5) * 100, 100);
    const intermediateProgress = Math.max(0, Math.min(((solvedCount - 5) / 10) * 100, 100));
    const advancedProgress = Math.max(0, Math.min(((solvedCount - 15) / 20) * 100, 100));

    const thisWeekProblems = solvedCount; 
    const thisWeekStreak = streak;

    return {
        message: `Welcome to the learner dashboard, ${user.name}!`, 
        stats: {
            solvedProblems: solvedCount,
            submissions: user.totalSubmissionsCount,
            rank: userRank || "Unranked",
            accuracy: Number(accuracy),
        },

        learningPath: {
            beginner: { progress: Math.round(beginnerProgress) }, 
            intermediate: { progress: Math.round(intermediateProgress) },
            advanced: { progress: Math.round(advancedProgress) },
        },

        thisWeek: {
            problemsSolved: thisWeekProblems,
            streak: thisWeekStreak,
        },
    };
};