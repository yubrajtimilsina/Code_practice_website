import User from "../../auth/models/UserModels.js";

export const manageAdmins = async (req, res) => {
  try {
    
    const admins = await User.find({ role: "admin" }).select("-_id name email role isActive createdAt");
    res.json({ admins });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const setAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, { role: "admin" }, { new: true }).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const revokeAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, { role: "learner" }, { new: true }).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};