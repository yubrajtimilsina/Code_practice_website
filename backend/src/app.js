import express from "express";
import cors from "cors";
import authRoutes from "./features/auth/routes/authRoutes.js";
import protectedRoutes from "./routes/protected.js";
import publicRoutes from "./routes/public.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", protectedRoutes);

app.use("/api", publicRoutes);


export default app;
