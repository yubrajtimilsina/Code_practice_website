import express from "express";
import cors from "cors";
import authRoutes from "./features/auth/routes/authRoutes.js";
import protectedRoutes from "./routes/protected.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api", protectedRoutes);



export default app;
