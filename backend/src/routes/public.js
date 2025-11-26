import { Router } from "express";
import authRoutes from "../features/auth/routes/authRoutes.js";

const router = Router();
router.use("/auth", authRoutes);

export default router;
