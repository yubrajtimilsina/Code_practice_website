import User from "../../auth/models/UserModels.js";
import Problem from "../../problems/models/ProblemModel.js";
import Submission from "../../submissions/models/submissionModel.js";
import DailyChallenge from "../../dailyChallenge/models/DailyChallengeModel.js";

// Get super admin dashboard
export const getSuperAdminDashboard = async (req, res) => {
  try {
    // All stats from admin dashboard
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    
    const usersByRole = await User.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } }
    ]);

    const totalProblems = await Problem.countDocuments();
    const totalSubmissions = await Submission.countDocuments();
    const acceptedSubmissions = await Submission.countDocuments({ isAccepted: true });

    // Admin-specific stats
    const totalAdmins = await User.countDocuments({ role: "admin" });
    const activeLearners = await User.countDocuments({ role: "learner", isActive: true });

    // System health metrics
    const avgProblemsPerUser = totalUsers > 0 
      ? (await Submission.countDocuments() / totalUsers).toFixed(2)
      : 0;

    // Recent admin actions (last 10 users created/modified)
    const recentUsers = await User.find()
      .select('name email role isActive createdAt')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    // Platform statistics
    const platformStats = {
      totalUsers,
      activeUsers,
      totalProblems,
      totalSubmissions,
      acceptedSubmissions,
      totalAdmins,
      activeLearners,
      avgProblemsPerUser: Number(avgProblemsPerUser)
    };

    const roleDistribution = usersByRole.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    res.json({
      message: "Super Admin Dashboard",
      stats: platformStats,
      roleDistribution,
      recentUsers
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Existing functions
export const manageAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" })
      .select("name email role isActive createdAt solvedProblemsCount totalSubmissionsCount")
      .lean();
    
    res.json({ admins });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const setAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(
      id, 
      { role: "admin" }, 
      { new: true }
    ).select("-password");
    
    if (!user) return res.status(404).json({ error: "User not found" });
    
    res.json({ 
      message: "User promoted to admin successfully",
      user 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const revokeAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(
      id, 
      { role: "learner" }, 
      { new: true }
    ).select("-password");
    
    if (!user) return res.status(404).json({ error: "User not found" });
    
    res.json({ 
      message: "Admin privileges revoked successfully",
      user 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// NEW: Get all users for super admin
export const getAllUsersForSuperAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 20, role, search } = req.query;
    
    const query = {};
    if (role && role !== 'all') query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await User.countDocuments(query);
    
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();
    
    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};