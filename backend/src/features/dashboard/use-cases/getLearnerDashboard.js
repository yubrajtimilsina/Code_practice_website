import User from "../../auth/models/UserModels.js";

export const getLearnerDashboard = async(userId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }

    const rank = user.solvedProblemsCount > 0 ? (1000 - user.solvedProblemsCount) : 0; 

    return {
        message: `Welcome to the learner dashboard, ${user.name}!`, 
        stats: {
            solvedProblems: user.solvedProblemsCount,
            submissions: user.totalSubmissionsCount,
            rank: rank,
        },

        learningPath: {
            beginner: { progress: 75 }, 
            intermediate: { progress: 45 },
            advanced: { progress: 10 },
        },
        thisWeek: {
            problemsSolved: 5,
            streak: 3,
        },
    };
};