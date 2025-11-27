import { Router } from "express";
import { authMiddleware } from "../../../middlewares/authMiddleware.js";
import { getProfile, listUsers } from "../controller/userController.js";
import { role } from "../../../middlewares/roleMiddleware.js";

const router = Router();


router.get("/", authMiddleware, getProfile);

// GET /api/users/all -> list all users (admin/super-admin only)
router.get("/all", authMiddleware, role("admin"), listUsers);


export default router;
