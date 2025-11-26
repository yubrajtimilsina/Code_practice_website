import { Router } from "express";
import { authMiddleware } from "../../../middlewares/authMiddleware.js";
import { isSuperAdmin } from "../../../middlewares/roleMiddleware.js";
import { manageAdmins } from "../controller/superAdminController.js";

const router = Router();

// GET /api/super-admin/manage-admins
router.get("/manage-admins", authMiddleware, isSuperAdmin, manageAdmins);

export default router;
