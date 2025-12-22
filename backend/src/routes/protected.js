import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { role } from "../middlewares/roleMiddleware.js";
import dashboardRoutes from "../features/dashboard/routes/dashboardRoutes.js";
import userRoutes from "../features/user/routes/userRoutes.js";
import adminRoutes from "../features/admin/routes/adminRoutes.js";
import superAdminRoutes from "../features/superAdmin/routes/superAdminRoutes.js";
import problemRoutes from "../features/problems/routes/problemRoutes.js";
import submissionRoutes from "../features/submissions/routes/submissionRoutes.js";
import leaderboardRoutes from "../features/leaderboard/routes/leaderboardRoutes.js";
import dailyChallengeRoutes from "../features/dailyChallenge/routes/dailyChallengeRoutes.js"
import discussionRoute from "../features/discussion/routes/discussionRoute.js";


const router = Router();

router.use(authMiddleware);

router.use("/dashboard", dashboardRoutes);
router.use("/users", userRoutes); 
router.use("/admin", adminRoutes); 
router.use("/super-admin", superAdminRoutes); 
router.use("/problems", problemRoutes);
router.use("/submissions", submissionRoutes);
router.use("/leaderboard", leaderboardRoutes);
router.use("/daily-challenge", dailyChallengeRoutes);
router.use("/discussion", discussionRoute);

export default router;  
