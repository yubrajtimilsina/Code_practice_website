import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/protected", authMiddleware, (req, res) => {
    res.json({user: req.user });
});

export default router;  

