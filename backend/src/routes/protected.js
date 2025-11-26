import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { role } from "../middlewares/roleMiddleware.js";
import dashboardRoutes from "../features/dashboard/routes/dashboardRoutes.js";
import userRoutes from "../features/user/routes/userRoutes.js";
import adminRoutes from "../features/admin/routes/adminRoutes.js";
import superAdminRoutes from "../features/superAdmin/routes/superAdminRoutes.js";
import { getProfile } from "../features/user/controller/userController.js";

const router = Router();



router.use("/dashboard", dashboardRoutes);
router.use("/users", userRoutes); 
router.use("/admin", adminRoutes); 
router.use("/super-admin", superAdminRoutes); 


router.get("/learner/profile", authMiddleware, getProfile);

export default router;  
