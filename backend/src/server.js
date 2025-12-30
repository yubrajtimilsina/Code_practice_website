import dotenv from "dotenv";
import { initializeCronJobs } from "./utils/cronJobs.js";

dotenv.config();

const requiredEnvVars = [
  'PORT',
  'MONGO_URL',
  'JWT_SECRET',
  'JUDGE0_API_URL',
  'JUDGE0_AUTH_TOKEN'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error(" FATAL ERROR: Missing required environment variables:");
  missingVars.forEach(varName => console.error(`   - ${varName}`));
  console.error("\n Check your .env file and ensure all variables are set.");
  process.exit(1);
}

console.log("All required environment variables loaded");

import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 5000;

process.on('uncaughtException', (error) => {
  console.error(" UNCAUGHT EXCEPTION:", error);
  console.error("Stack:", error.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error(" UNHANDLED REJECTION at:", promise);
  console.error("Reason:", reason);
  process.exit(1);
});

const startServer = async () => {
  try {
    // 1. Connect to database FIRST
    console.log(" Connecting to MongoDB...");
    await connectDB();
    console.log(" MongoDB connected successfully");

    console.log("Initializing scheduled tasks...");
    initializeCronJobs();
    console.log(" Scheduled tasks initialized");

    const server = app.listen(PORT, () => {
      console.log(` Server running on port ${PORT}`);
      console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(` API URL: http://localhost:${PORT}/api`);
      console.log(` JWT Secret: ${process.env.JWT_SECRET ? '***configured***' : '❌ MISSING'}`);
      console.log(` Judge0 URL: ${process.env.JUDGE0_API_URL}`);
    });

  } catch (error) {
    console.error(" FATAL: Server startup failed:", error);
    process.exit(1);
  }
};

startServer();