import User from "../../auth/models/UserModels.js";
import Problem from "../../problems/models/ProblemModel.js";
import Submission from "../../submissions/models/submissionModel.js";
import DailyChallenge from "../../dailyChallenge/models/DailyChallengeModel.js";
import Discussion from "../../discussion/models/DiscussionModel.js";
import SystemSettings from "../models/SystemSettingsModel.js";

export const getSuperAdminDashboard = async (req, res) => {
  try {
    const [
      totalUsers,
      activeUsers,
      totalAdmins,
      activeLearners,
      totalProblems,
      totalSubmissions,
      acceptedSubmissions,
      totalDailyChallenges,
      activeDailyChallenges,
      problemsWithSubmissions,
      topContributors
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      User.countDocuments({ role: { $in: ["admin", "super-admin"] } }),
      User.countDocuments({ role: "learner", isActive: true }),
      Problem.countDocuments(),
      Submission.countDocuments(),
      Submission.countDocuments({ isAccepted: true }),
      DailyChallenge.countDocuments(),
      DailyChallenge.countDocuments({ isActive: true }),
      Problem.countDocuments({ totalSubmissions: { $gt: 0 } }),
      User.aggregate([
        { $match: { role: "learner" } },
        { $sort: { solvedProblemsCount: -1 } },
        { $limit: 10 },
        {
          $project: {
            name: 1,
            email: 1,
            solvedProblemsCount: 1,
            totalSubmissionsCount: 1,
            rankPoints: 1
          }
        }
      ])
    ]);

    const avgProblemsPerUser = totalUsers > 0
      ? (totalSubmissions / totalUsers).toFixed(2)
      : 0;

    const platformAccuracy = totalSubmissions > 0
      ? ((acceptedSubmissions / totalSubmissions) * 100).toFixed(2)
      : 0;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [recentUsers, recentSubmissions, roleDistribution] = await Promise.all([
      User.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      Submission.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      User.aggregate([
        {
          $group: {
            _id: "$role",
            count: { $sum: 1 },
            active: {
              $sum: { $cond: ["$isActive", 1, 0] }
            }
          }
        }
      ])
    ]);

    const problemEngagementRate = totalProblems > 0
      ? ((problemsWithSubmissions / totalProblems) * 100).toFixed(2)
      : 0;

    res.json({
      message: "Super Admin Dashboard",
      stats: {
        totalUsers,
        activeUsers,
        inactiveUsers: totalUsers - activeUsers,
        totalAdmins,
        activeLearners,
        totalProblems,
        totalSubmissions,
        acceptedSubmissions,
        avgProblemsPerUser: Number(avgProblemsPerUser),
        platformAccuracy: Number(platformAccuracy),
        problemEngagementRate: Number(problemEngagementRate),
        totalDailyChallenges,
        activeDailyChallenges,
        recentUsers,
        recentSubmissions
      },
      roleDistribution: roleDistribution.reduce((acc, role) => {
        acc[role._id] = {
          total: role.count,
          active: role.active
        };
        return acc;
      }, {}),
      topContributors,
      systemHealth: {
        status: "operational",
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error("Super Admin Dashboard Error:", error);
    res.status(500).json({ error: "Failed to fetch super admin dashboard data" });
  }
};

export const getSystemHealth = async (req, res) => {
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

  const dbHealth = {
    status: 'healthy',
    collections: {
      users: totalUsers,
      problems: totalProblems,
      submissions: totalSubmissions
    }
  };

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
};


// Existing functions
export const manageAdmins = async (req, res) => {
  const admins = await User.find({ role: "admin" })
    .select("name email role isActive createdAt solvedProblemsCount totalSubmissionsCount")
    .lean();

  res.json({ admins });
};

export const setAdmin = async (req, res) => {
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
};

export const revokeAdmin = async (req, res) => {
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
};

export const getAllUsersForSuperAdmin = async (req, res) => {
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
};

export const deleteUserBySuperAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user._id;

    // Prevent self-deletion
    if (id === currentUserId.toString()) {
      return res.status(400).json({ error: "You cannot delete your own account" });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Delete all user's associated data
    console.log(`[SUPER ADMIN] Deleting user ${user.email} and all associated data...`);

    // 1. Delete user's submissions
    const deletedSubmissions = await Submission.deleteMany({ userId: id });
    console.log(`Deleted ${deletedSubmissions.deletedCount} submissions`);

    // 2. Remove user from daily challenge completions and leaderboards
    await DailyChallenge.updateMany(
      { 'completedBy.userId': id },
      {
        $pull: {
          completedBy: { userId: id },
          leaderboard: { userId: id }
        }
      }
    );
    console.log(`Removed user from daily challenges`);

    // 3. Delete user's discussions
    const deletedDiscussions = await Discussion.deleteMany({ userId: id });
    console.log(`Deleted ${deletedDiscussions.deletedCount} discussions`);

    // 4. Delete user's comments from discussions
    await Discussion.updateMany(
      { 'comments.userId': id },
      { $pull: { comments: { userId: id } } }
    );
    console.log(`Removed user's comments from discussions`);

    // 5. Remove user from votes in discussions
    await Discussion.updateMany(
      { $or: [{ upvotes: id }, { downvotes: id }] },
      {
        $pull: {
          upvotes: id,
          downvotes: id
        }
      }
    );
    console.log(`Removed user's votes from discussions`);

    // 6. Finally, delete the user
    await User.findByIdAndDelete(id);

    console.log(`[SUPER ADMIN] Successfully deleted user ${user.email}`);

    res.json({
      message: "User and all associated data deleted successfully",
      deletedUser: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      deletedData: {
        submissions: deletedSubmissions.deletedCount,
        discussions: deletedDiscussions.deletedCount
      }
    });
  } catch (error) {
    console.error('[SUPER ADMIN] Delete user error:', error);
    res.status(500).json({ error: error.message || 'Failed to delete user' });
  }
};

export const getSystemSettings = async (req, res) => {
  try {
    let settings = await SystemSettings.findOne();
    if (!settings) {
      settings = await SystemSettings.create({});
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch settings" });
  }
};

export const updateSystemSettings = async (req, res) => {
  try {
    const { siteName, maintenanceMode, allowRegistration, contestMode } = req.body;
    let settings = await SystemSettings.findOne();

    if (!settings) {
      settings = new SystemSettings();
    }

    settings.siteName = siteName ?? settings.siteName;
    settings.maintenanceMode = maintenanceMode ?? settings.maintenanceMode;
    settings.allowRegistration = allowRegistration ?? settings.allowRegistration;
    settings.contestMode = contestMode ?? settings.contestMode;
    settings.updatedBy = req.user._id;
    settings.lastUpdated = new Date();

    await settings.save();
    res.json({ message: "Settings updated successfully", settings });
  } catch (error) {
    res.status(500).json({ error: "Failed to update settings" });
  }
};
