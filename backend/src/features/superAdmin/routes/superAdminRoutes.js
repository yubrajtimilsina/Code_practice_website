import { Router } from "express";
import { authMiddleware } from "../../../middlewares/authMiddleware.js";
import { isSuperAdmin } from "../../../middlewares/roleMiddleware.js";
import { manageAdmins, setAdmin, revokeAdmin } from "../controller/superAdminController.js";

const router = Router();


router.get("/manage-admins", authMiddleware, isSuperAdmin, manageAdmins);

router.put("/:id/set-admin", authMiddleware, isSuperAdmin, setAdmin);
router.put("/:id/revoke-admin", authMiddleware, isSuperAdmin, revokeAdmin);

export default router;
