import { Router } from "express";
import { authMiddleware } from "../../../middlewares/authMiddleware.js";
import { getProfile, listUsers, blockUser, deleteUser, updateProfile } from "../controller/userController.js";
import { role, isAdmin } from "../../../middlewares/roleMiddleware.js";

const router = Router();

// GET /api/users -> profile of current user (any authenticated user)
router.get("/profile", authMiddleware, getProfile);

// GET /api/users -> list all users (admin/super-admin only)
router.get("/", authMiddleware, isAdmin, listUsers);

router.put("/:id/block", authMiddleware, isAdmin, blockUser);
router.delete("/:id", authMiddleware, isAdmin, deleteUser);
router.put("/profile", authMiddleware, updateProfile);

export default router;
