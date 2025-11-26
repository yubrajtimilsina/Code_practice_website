import { Router } from "express";
import { 
  createProblemController, 
  updateProblemController, 
  deleteProblemController,
  listProblemsController, 
  getProblemController 
} from "../controller/problemController.js";
import { role } from "../../../middlewares/roleMiddleware.js";
import { authMiddleware } from "../../../middlewares/authMiddleware.js";

const router = Router();

// Public routes
router.get("/", listProblemsController);
router.get("/:id", getProblemController);

// Protected routes - Admin/Super-admin only
router.post(
  "/",
  authMiddleware,
  role("admin", "super-admin"),
  createProblemController
);

router.put(
  "/:id",
  authMiddleware,
  role("admin", "super-admin"),
  updateProblemController
);

router.delete(
  "/:id",
  authMiddleware,
  role("admin", "super-admin"),
  deleteProblemController
);

export default router;