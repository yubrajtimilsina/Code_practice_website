import { Router } from "express";
import { authMiddleware } from "../../../middlewares/authMiddleware.js";
import { getProfile, listUsers, blockUser, deleteUser, updateProfile } from "../controller/userController.js";
import { role } from "../../../middlewares/roleMiddleware.js";

const router = Router();

// GET /api/users -> profile of current user (any authenticated user)
router.get("/profile", authMiddleware, getProfile);

// GET /api/users -> list all users (admin/super-admin only) - if user is admin
router.get("/", authMiddleware, listUsers);

router.put("/:id/block", authMiddleware, role("admin"), blockUser);
router.delete("/:id", authMiddleware, role("admin"), deleteUser);
router.put("/profile", authMiddleware, updateProfile);

export default router;
