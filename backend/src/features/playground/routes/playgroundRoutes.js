import { Router } from "express";
import { body } from "express-validator";
import { authMiddleware } from "../../../middlewares/authMiddleware.js";
import { handleValidationErrors} from "../../../middlewares/errorMiddleware.js";
import { executePlaygroundCode, getPlaygroundStats } from "../controller/playgroundController.js";
import { submissionLimiter } from "../../../middlewares/rateLimitMiddleware.js";
const router = Router();

const playgroundValidation = [
  body("code").notEmpty().withMessage("Code is required"),
  body("language").notEmpty().withMessage("Language is required"),
  body("input").optional().isString()
];


router.post(
  "/execute",
  submissionLimiter,
  playgroundValidation,
  handleValidationErrors,
  executePlaygroundCode
);

// Get playground stats
router.get(
  "/stats",
  authMiddleware,
  getPlaygroundStats
);

export default router;
