import { Router } from "express";
import { role, isSuperAdmin } from "../../../middlewares/roleMiddleware.js";
import { authMiddleware } from "../../../middlewares/authMiddleware.js";
import { learnerDashboard, adminDashboard } from "../controller/dashboardController.js";

const router = Router();
router.get("/learner", authMiddleware, role("learner"), learnerDashboard);
router.get("/admin", authMiddleware, role("admin", "super-admin"), adminDashboard);



export default router;