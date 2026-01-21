import { Router } from "express";
import { body } from "express-validator";

import { register, login, me, googleLogin, forgotPassword, resetPassword, verifyResetToken } from "../controller/authController.js";
import { authMiddleware } from "../../../middlewares/authMiddleware.js";
import { handleValidationErrors } from "../../../middlewares/errorMiddleware.js";

const router = Router();

router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .notEmpty().withMessage("Password is required")
      .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage("Password must contain at least one uppercase letter, one lowercase letter, and one number"),
    body("role").optional().isIn(["learner", "admin"]).withMessage("Invalid role specified"),
  ],
  handleValidationErrors,
  register
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  handleValidationErrors,
  login
);

// FIXED: Added validation for forgot password
router.post(
  "/forgot-password",
  [
    body("email")
      .notEmpty().withMessage("Email is required")
      .isEmail().withMessage("Valid email is required")
      .normalizeEmail()
  ],
  handleValidationErrors,
  forgotPassword
);

// NEW: Verify reset token before showing reset form
router.get(
  "/verify-reset-token/:token",
  verifyResetToken
);

// FIXED: Added validation for reset password
router.put(
  "/reset-password/:token",
  [
    body("password")
      .notEmpty().withMessage("Password is required")
      .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage("Password must contain at least one uppercase letter, one lowercase letter, and one number")
  ],
  handleValidationErrors,
  resetPassword
);

router.post("/google", googleLogin);

router.get("/me", authMiddleware, me);

export default router;