import User from "../../auth/models/UserModels.js";

export const getProfile = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    // req.user already has no password thanks to findUserById select in authMiddleware
    const { _id: id, name, email, role, isActive, createdAt, solvedProblemsCount, totalSubmissionsCount } = req.user;
    res.json({ id, name, email, role, isActive, createdAt, solvedProblemsCount, totalSubmissionsCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const listUsers = async (req, res) => {
  try {
    // Only authenticated users can call this; optionally restrict to admin
    const users = await User.find().select("_id name email role isActive createdAt solvedProblemsCount totalSubmissionsCount");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const blockUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, { isActive: false }, { new: true }).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};