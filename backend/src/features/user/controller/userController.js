import User from "../../auth/models/UserModels.js";

export const getProfile = async (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });
  const { _id: id, name, email, role, isActive, createdAt, solvedProblemsCount, totalSubmissionsCount } = req.user;
  res.json({ id, name, email, role, isActive, createdAt, solvedProblemsCount, totalSubmissionsCount });
};

export const listUsers = async (req, res) => {
  const { page = 1, limit = 10, role, search, sortBy = 'createdAt', order = 'desc' } = req.query;
  
  // Build query
  const query = {};
  if (role && role !== 'all') {
    query.role = role;
  }
  if (search && search.trim()) {
    query.$or = [
      { name: { $regex: search.trim(), $options: 'i' } },
      { email: { $regex: search.trim(), $options: 'i' } }
    ];
  }
 
  const sortOptions = {};
  sortOptions[sortBy] = order === 'asc' ? 1 : -1;
  
  // Calculate pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  // Get total count
  const total = await User.countDocuments(query);
 
  const users = await User.find(query)
    .select("_id name email role isActive createdAt solvedProblemsCount totalSubmissionsCount acceptedSubmissionsCount rankPoints currentStreak longestStreak easyProblemsSolved mediumProblemsSolved hardProblemsSolved")
    .sort(sortOptions)
    .skip(skip)
    .limit(parseInt(limit));
  
  res.json({
    users,
    total,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit)),
      hasNextPage: skip + users.length < total,
      hasPrevPage: page > 1
    }
  });
};

export const blockUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findByIdAndUpdate(id, { isActive: false }, { new: true }).select("-password");
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findByIdAndDelete(id).select("-password");
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ message: "User deleted successfully" });
};
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, email, currentPassword, newPassword } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // If changing password, verify current password
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ error: "Current password is required" });
      }
      
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Current password is incorrect" });
      }
      
      if (newPassword.length < 6) {
        return res.status(400).json({ error: "New password must be at least 6 characters" });
      }
      
      user.password = await bcrypt.hash(newPassword, 10);
    }
    
    // Update name if provided
    if (name && name.trim()) {
      user.name = name.trim();
    }
    
    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email: email.toLowerCase() });
      if (emailExists) {
        return res.status(400).json({ error: "Email already in use" });
      }
      user.email = email.toLowerCase();
    }
    
    await user.save();
    
    res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: error.message });
  }
};
