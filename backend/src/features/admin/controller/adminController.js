import { getAdminDashboard as getAdminDashboardUseCase } from "../../dashboard/use-cases/getAdminDashboard.js";
import User from "../../auth/models/UserModels.js";
import Submission from "../../submissions/models/submissionModel.js";
import DailyChallenge from "../../dailyChallenge/models/DailyChallengeModel.js";
import Discussion from "../../discussion/models/DiscussionModel.js";


export const getAdminDashboard = async (req, res) => {
  try {
    const dashboardData = await getAdminDashboardUseCase();
    res.json({ dashboard: dashboardData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search, isActive } = req.query;
    
    const query = {};
    if (role && role !== 'all') query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (isActive !== undefined) query.isActive = isActive === 'true';
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await User.countDocuments(query);
    
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
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

export const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    user.isActive = !user.isActive;
    await user.save();
    
    res.json({ 
      message: `User ${user.isActive ? 'activated' : 'blocked'} successfully`,
      user: { ...user.toObject(), password: undefined }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteUser = async (req, res) => {
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
    
    // Prevent deletion of super-admin by regular admin
    if (user.role === 'super-admin' && req.user.role !== 'super-admin') {
      return res.status(403).json({ error: "Only super-admin can delete other super-admins" });
    }
    
    // Delete user's submissions
    await Submission.deleteMany({ userId: id });
    
    // Delete the user
    await User.findByIdAndDelete(id);
    
    res.json({ 
      message: "User and all associated data deleted successfully",
      deletedUser: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: error.message });
  }
};