import { Router } from "express";
import { authMiddleware } from "../../../middlewares/authMiddleware.js";
import { role } from "../../../middlewares/roleMiddleware.js";
import { getAdminDashboard } from "../controller/adminController.js";

const router = Router();


router.get("/dashboard", authMiddleware, role("admin", "super-admin"), getAdminDashboard);

export default router;
