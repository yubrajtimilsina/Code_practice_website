import User from "../../auth/models/UserModels.js";

export const manageAdmins = async (req, res) => {
  try {
    // return list of admin users and their basic info
    const admins = await User.find({ role: "admin" }).select("-_id name email role isActive createdAt");
    res.json({ admins });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
