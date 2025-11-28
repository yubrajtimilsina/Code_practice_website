import jwt from "jsonwebtoken";
import { findUserById } from "../features/auth/repository/userRepository.js";

export const authMiddleware = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    try {
      // Extract token properly
      token = req.headers.authorization.substring(7); // Remove "Bearer "
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await findUserById(decoded.id);
      
      if (!req.user) {
        return res.status(401).json({ error: "User not found" });
      }
      
      return next(); 
      
    } catch (error) {
      console.error("Auth error:", error.message);
      return res.status(401).json({ error: "Not authorized, token failed" });
    }
  }

  // No token provided
  return res.status(401).json({ error: "Not authorized, no token provided" });
};