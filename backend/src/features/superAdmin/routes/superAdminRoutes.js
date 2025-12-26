import { Router } from "express";
import { authMiddleware } from "../../../middlewares/authMiddleware.js";
import { isSuperAdmin } from "../../../middlewares/roleMiddleware.js";
import {getSuperAdminDashboard, manageAdmins, setAdmin, revokeAdmin, getAllUsersForSuperAdmin } from "../controller/superAdminController.js";

const router = Router();

router.get("/dashboard", authMiddleware, isSuperAdmin, getSuperAdminDashboard);


router.get("/manage-admins", authMiddleware, isSuperAdmin, manageAdmins);

router.put("/:id/set-admin", authMiddleware, isSuperAdmin, setAdmin);
router.put("/:id/revoke-admin", authMiddleware, isSuperAdmin, revokeAdmin);

router.get("/users", authMiddleware, isSuperAdmin, getAllUsersForSuperAdmin);

export default router;
