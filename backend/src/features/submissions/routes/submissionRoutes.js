import { Router } from "express";
import { body } from "express-validator";
import { submitSolution, runCode, saveDraft, getDraftCode, getSubmission, getHistory, getAccepted, getProblemStats, removeSubmission, getUserStatistics, getLatestAccepted, getAllSubmissions } from "../controller/submissionController.js";

import { role } from "../../../middlewares/roleMiddleware.js";
import { handleValidationErrors } from "../../../middlewares/errorMiddleware.js";
import { authMiddleware } from "../../../middlewares/authMiddleware.js";
import { submissionLimiter } from "../../../middlewares/rateLimitMiddleware.js";

const router = Router();

router.use(authMiddleware);

const submissionValidation = [
  body("code").notEmpty().withMessage("Code is required"),
  body("language").notEmpty().withMessage("Language is required"),
  body("problemId").notEmpty().withMessage("Problem ID is required"),
];

router.post("/submit", submissionLimiter, submissionValidation, handleValidationErrors, submitSolution);

router.post("/run", submissionLimiter, submissionValidation, handleValidationErrors, runCode);

router.put(
  "/draft/:problemId",
  saveDraft
);

router.get(
  "/draft/:problemId",
  getDraftCode
);

router.get(
  "/:submissionId",
  getSubmission
);

router.get(
  "/",
  getHistory
);

router.get(
  "/admin/all",
  role("admin", "super-admin"),
  getAllSubmissions
);

router.get(
  "/user/accepted-problems",
  getAccepted
);

router.get(
  "/user/stats",
  getUserStatistics
);

router.get(
  "/problem/:problemId/accepted",
  getLatestAccepted
);

router.delete(
  "/:submissionId",
  removeSubmission
);

router.get(
  "/problems/:problemId/submissions",
  role("admin", "super-admin"),
  getProblemStats
);


export default router;