import { Router } from "express";
import { body, validationResult} from "express-validator";
import { 
  createProblemController, 
  updateProblemController, 
  deleteProblemController,
  listProblemsController, 
  getProblemController 
} from "../controller/problemController.js";
import { role } from "../../../middlewares/roleMiddleware.js";
import { handleValidationErrors } from "../../../middlewares/errorMiddleware.js";
import { authMiddleware } from "../../../middlewares/authMiddleware.js";

const router = Router();

router.use(authMiddleware);

const problemValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3, max: 200 })
    .withMessage("Title must be between 3-200 characters"),
  
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters"),
  
  body("difficulty")
    .trim()
    .notEmpty()
    .withMessage("Difficulty is required")
    .isIn(["Easy", "Medium", "Hard"])
    .withMessage("Difficulty must be Easy, Medium, or Hard"),
  
  body("sampleInput")
    .trim()
    .notEmpty()
    .withMessage("Sample input is required"),
  
  body("sampleOutput")
    .trim()
    .notEmpty()
    .withMessage("Sample output is required"),
  
  body("timeLimitSec")
    .isInt({ min: 1, max: 30 })
    .withMessage("Time limit must be between 1-30 seconds"),
  
  body("memoryLimitMB")
    .isInt({ min: 64, max: 1024 })
    .withMessage("Memory limit must be between 64-1024 MB"),
  
  body("tags")
    .optional()
    .isArray()
    .withMessage("Tags must be an array"),
  
  body("testCases")
    .optional()
    .isArray()
    .withMessage("Test cases must be an array"),
];

const adminAuth = [authMiddleware, role("admin", "super-admin")];

// Public routes
router.get("/", listProblemsController);
router.get("/:id", getProblemController);

router.post("/", adminAuth, problemValidation, handleValidationErrors, createProblemController);
router.put("/:id", adminAuth, problemValidation, handleValidationErrors, updateProblemController);
router.delete("/:id", adminAuth, deleteProblemController);

export default router;