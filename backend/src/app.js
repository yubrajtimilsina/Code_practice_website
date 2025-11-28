import express from "express";
import cors from "cors";
import authRoutes from "./features/auth/routes/authRoutes.js";
import protectedRoutes from "./routes/protected.js";
import publicRoutes from "./routes/public.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", publicRoutes);
app.use("/api", protectedRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("Ërror:", err.stack);
  res.status(err.status || 500).json({ 
    error: err.message || "Internal Server Error" 
  });
});


export default app;
