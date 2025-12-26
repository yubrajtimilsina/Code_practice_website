import { Router } from "express";
import { authMiddleware } from "../../../middlewares/authMiddleware.js";
import { role } from "../../../middlewares/roleMiddleware.js";
import { getAdminDashboard, getAllUsers, toggleUserStatus } from "../controller/adminController.js";

const router = Router();


router.get("/dashboard", authMiddleware, role("admin", "super-admin"), getAdminDashboard);
router.get("/users", authMiddleware, role("admin", "super-admin"), getAllUsers);
router.put("/users/:id/toggle-status", authMiddleware, role("admin", "super-admin"), toggleUserStatus);



export default router;
