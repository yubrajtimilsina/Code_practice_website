import { Router } from "express";
import {body, validationResult } from "express-validator";

import { register, login, me } from "../controller/authController.js";
import { authMiddleware } from "../../../middlewares/authMiddleware.js";
const router = Router();


router.post(
  "/register",
  [body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
    ],
    register
);

router.post(
  "/login",
  [body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
  ],
  login
);

router.get("/me", authMiddleware, me);

export default router;