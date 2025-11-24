import { getLearnerDashboard } from "../use-cases/getLearnerDashboard.js";
import { getAdminDashboard } from "../use-cases/getAdminDashboard.js";

export const learnerDashboard = async (req, res) => {
  try {
    const data = await getLearnerDashboard(req.user._id);
    res.json({ user: req.user, dashboard: data });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch learner dashboard" });
  }
};
export const adminDashboard = async (req, res) => {
    try {
        const data = await getAdminDashboard();
        res.json({ user: req.user, dashboard: data });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch admin dashboard" });
    }
};