import User from "../../auth/models/UserModels.js";

export const getLearnerDashboard = async(userId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }

    
    const allUsers = await User.find({ isActive: true });
    const userRank = allUsers
        .filter(u => u.solvedProblemsCount > 0)
        .sort((a, b) => b.solvedProblemsCount - a.solvedProblemsCount)
        .findIndex(u => u._id.toString() === userId.toString()) + 1;

  
    const accuracy = user.totalSubmissionsCount > 0
        ? ((user.solvedProblemsCount / user.totalSubmissionsCount) * 100).toFixed(1)
        : 0;

 
    const streak = user.totalSubmissionsCount > 0 ? Math.min(user.totalSubmissionsCount, 30) : 0;

  
    const solvedCount = user.solvedProblemsCount || 0;
    const beginnerProgress = Math.min((solvedCount / 5) * 100, 100);
    const intermediateProgress = Math.max(0, Math.min(((solvedCount - 5) / 10) * 100, 100));
    const advancedProgress = Math.max(0, Math.min(((solvedCount - 15) / 20) * 100, 100));

  
    const thisWeekProblems = 0; 
    const thisWeekStreak = streak > 0 ? Math.floor(Math.random() * 7) + 1 : 0; 

    return {
        message: `Welcome to the learner dashboard, ${user.name}!`, 
        stats: {
            solvedProblems: solvedCount,
            submissions: user.totalSubmissionsCount,
            rank: userRank || "Unranked",
            accuracy: accuracy,
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