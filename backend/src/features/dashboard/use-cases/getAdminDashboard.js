import User from "../../auth/models/UserModels.js";
import Problem from "../../problems/models/ProblemModel.js";

export const getAdminDashboard = async() => {
    const totalUsers = await User.countDocuments();
    const totalProblems = await Problem.countDocuments();

    const users = await User.find().select("totalSubmissionsCount");
    const totalSubmissions = users.reduce((sum, user) => sum + (user.totalSubmissionsCount || 0), 0);

    return {
        message: `Welcome to the admin dashboard!`,
        stats: {
            totalUsers: totalUsers,
            totalProblems: totalProblems,
            totalSubmissions: totalSubmissions
        }  
    };
};
