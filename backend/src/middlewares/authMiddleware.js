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

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

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
