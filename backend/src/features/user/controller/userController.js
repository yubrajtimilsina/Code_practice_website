import User from "../../auth/models/UserModels.js";

export const getProfile = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    // req.user already has no password thanks to findUserById select in authMiddleware
    const { _id: id, name, email, role, isActive, createdAt } = req.user;
    res.json({ id, name, email, role, isActive, createdAt });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const listUsers = async (req, res) => {
  try {
    // Only authenticated users can call this; optionally restrict to admin
    const users = await User.find().select("-_id name email role isActive createdAt");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
