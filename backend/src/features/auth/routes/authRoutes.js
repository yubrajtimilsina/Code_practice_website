import { Router } from "express";
import { body } from "express-validator";

import { register, login, me, googleLogin, forgotPassword, resetPassword } from "../controller/authController.js";
import { authMiddleware } from "../../../middlewares/authMiddleware.js";
import { handleValidationErrors } from "../../../middlewares/errorMiddleware.js";
const router = Router();


router.post(
  "/register",
  [body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
  body("role").optional().isIn(["learner", "admin"]).withMessage("Invalid role specified"),
  ],
  handleValidationErrors,
  register
);

router.post(
  "/login",
  [body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
  ],
  handleValidationErrors,
  login
);

router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);

router.post("/google", googleLogin);

router.get("/me", authMiddleware, me);

export default router;