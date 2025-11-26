export const getAdminDashboard = async (req, res) => {
  try {
    res.json({ message: "Welcome to admin dashboard", user: { id: req.user._id, role: req.user.role } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
