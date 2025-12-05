import { Router } from "express";
import { body } from "express-validator";
import { submitSolution, runCode, saveDraft, getDraftCode, getSubmission, getHistory,getAccepted, getProblemStats, removeSubmission, getUserStatistics, getLatestAccepted } from "../controller/submissionController.js";

import { role } from "../../../middlewares/roleMiddleware.js";
import { authMiddleware } from "../../../middlewares/authMiddleware.js";

const router = Router();

router.use(authMiddleware);

const submissionValidation = [
  body("code").notEmpty().withMessage("Code is required"),
  body("language").notEmpty().withMessage("Language is required"),
  body("problemId").notEmpty().withMessage("Problem ID is required"),
];

router.post("/submit", submissionValidation, submitSolution );

router.post("/run", submissionValidation,runCode );

router.post(
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
  "/accepted-problems",
  getAccepted
);

router.get(
  "/stats/user-stats",
  getUserStatistics
);

router.get(
  "/accepted/:problemId",
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