import { Router } from "express";
import { authMiddleware } from "../../../middlewares/authMiddleware.js";
import { role } from "../../../middlewares/roleMiddleware.js";
import { learnerDashboard, adminDashboard } from "../controller/dashboardController.js";

const router = Router();
router.get("/learner", authMiddleware, role("learner", "admin"), learnerDashboard);
router.get("/admin", authMiddleware, role("admin"), adminDashboard);

export default router;