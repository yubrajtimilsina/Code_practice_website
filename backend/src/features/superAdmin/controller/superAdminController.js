import User from "../../auth/models/UserModels.js";
import Problem from "../../problems/models/ProblemModel.js";
import Submission from "../../submissions/models/submissionModel.js";
import DailyChallenge from "../../dailyChallenge/models/DailyChallengeModel.js";
import Discussion from "../../discussion/models/DiscussionModel.js";

export const getSuperAdminDashboard = async (req, res) => {
  try {
    // Get all user statistics
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const totalAdmins = await User.countDocuments({ 
      role: { $in: ["admin", "super-admin"] } 
    });
    const activeLearners = await User.countDocuments({ 
      role: "learner", 
      isActive: true 
    });

    // Get all problems and submissions
    const totalProblems = await Problem.countDocuments();
    const totalSubmissions = await Submission.countDocuments();
    const acceptedSubmissions = await Submission.countDocuments({ isAccepted: true });

    // Calculate system metrics
    const avgProblemsPerUser = totalUsers > 0 
      ? (totalSubmissions / totalUsers).toFixed(2)
      : 0;

    const platformAccuracy = totalSubmissions > 0
      ? ((acceptedSubmissions / totalSubmissions) * 100).toFixed(2)
      : 0;

    // Get role distribution
    const roleDistribution = await User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
          active: {
            $sum: { $cond: ["$isActive", 1, 0] }
          }
        }
      }
    ]);

    // Get daily challenge stats
    const totalDailyChallenges = await DailyChallenge.countDocuments();
    const activeDailyChallenges = await DailyChallenge.countDocuments({ isActive: true });

    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentUsers = await User.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });
    
    const recentSubmissions = await Submission.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    // System health metrics
    const problemsWithSubmissions = await Problem.countDocuments({
      totalSubmissions: { $gt: 0 }
    });

    const problemEngagementRate = totalProblems > 0
      ? ((problemsWithSubmissions / totalProblems) * 100).toFixed(2)
      : 0;

    // Get top contributors
    const topContributors = await User.aggregate([
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
    ]);

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
