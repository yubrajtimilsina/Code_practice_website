import { Router} from "express";
import { role } from "../../../middlewares/roleMiddleware.js";
import { authMiddleware } from "../../../middlewares/authMiddleware.js";

import { getGlobalLeaderboard, getUserRank, getUserProgress } from "../controller/leaderboardController.js";
import { getProblemStatistics } from "../../problems/services/problemService.js";
import { getSystemHealth } from "../../superAdmin/controller/superAdminController.js";

const router = Router();

router.get("/", getGlobalLeaderboard);

router.get("/my-rank", authMiddleware, getUserRank);
router.get("/my-progress", authMiddleware, getUserProgress);

router.get("/problem/:problemId/stats", authMiddleware, role ("admin", "super-admin"), getProblemStatistics);

router.get("/system/health", authMiddleware, role("super-admin"), getSystemHealth);

export default router;

