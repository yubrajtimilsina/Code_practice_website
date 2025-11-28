import { Router } from "express";
import { authMiddleware } from "../../../middlewares/authMiddleware.js";
import { getProfile, listUsers, blockUser, deleteUser } from "../controller/userController.js";
import { role } from "../../../middlewares/roleMiddleware.js";

const router = Router();


router.get("/", authMiddleware, getProfile);

// GET /api/users/all -> list all users (admin/super-admin only)
router.get("/all", authMiddleware, role("admin"), listUsers);

router.put("/:id/block", authMiddleware, role("admin"), blockUser);
router.delete("/:id", authMiddleware, role("admin"), deleteUser);

export default router;
