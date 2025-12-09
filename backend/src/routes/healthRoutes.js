import {Router } from "express";
import { testJudge0Connection } from "../features/submissions/services/judge0Service.js";

const router = Router();

router.get("/judge0", async (req, res) => {
    try {
        const result = await testJudge0Connection();
        
        if (result.success) {
            res.status(200).json({
                status: "healthy",
                message: "Judge0 is running",
                version: result.version,
                url: process.env.JUDGE0_API_URL,
                data: result.data
            });
        } else {
            res.status(503).json({
                status: "unhealthy",
                message: "Judge0 is not responding",
                error: result.error,
                url: process.env.JUDGE0_API_URL
            });
        }
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Failed to check Judge0 health",
            error: error.message
        });
    }
});


router.get("/", (req, res) => {
    res.status(200).json({
        status: "healthy",
        message: "API is running",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
});

export default router;