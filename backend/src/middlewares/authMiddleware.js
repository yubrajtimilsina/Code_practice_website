import jwt from "jsonwebtoken";
import { findUserById } from "../features/auth/repository/userRepository.js";

export const authMiddleware = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      
      if (!token || typeof token !== "string" || token.split('.').length !== 3) {
        console.error("Auth error: invalid token format", token);
        return res.status(401).json({ error: "Not authorized, invalid token format" });
      }

      const decoded = jwt.verify(token.trim(), process.env.JWT_SECRET);

      req.user = await findUserById(decoded.id);

      if( ! req.user){
        return res.status(401).json({ error: "User not found"});
      }

      next();
    } catch (error) {
      console.error("Auth error:", error.message);
      res.status(401).json({ error: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ error: "Not authorized, no token" });
  }
};
