import jwt from "jsonwebtoken";
import { findUserById } from "../features/auth/repository/userRepository.js";

export const authMiddleware = async (req, res, next) => {
  try {

    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ 
        error: "Authorization header missing or invalid format" 
      });
    }

    const token = authHeader.substring(7).trim();
    
    if (!token || token === "null" || token === "undefined") {
      return res.status(401).json({ 
        error: "Invalid authentication token" 
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error(" FATAL: JWT_SECRET not configured");
      return res.status(500).json({ 
        error: "Server authentication configuration error" 
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      console.error(" JWT verification failed:", jwtError.message);
      
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          error: "Token expired. Please login again." 
        });
      }
      
      return res.status(401).json({ 
        error: "Invalid or malformed token" 
      });
    }

    if (!decoded || !decoded.id) {
      return res.status(401).json({ 
        error: "Token payload invalid" 
      });
    }

    const user = await findUserById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ 
        error: "User not found or has been deleted" 
      });
    }

    //  Check if user is active
    if (!user.isActive) {
      return res.status(403).json({ 
        error: "Account has been deactivated. Contact support." 
      });
    }

    //  Attach user to request
    req.user = user;
    
    //  Log successful authentication (development only)
    if (process.env.NODE_ENV === 'development') {
      console.log(`Auth success: ${user.email} (${user.role})`);
    }
    
    return next();
    
  } catch (error) {
    console.error(" Auth middleware error:", error.message);
    return res.status(500).json({ 
      error: "Authentication system error" 
    });
  }
};

//  NEW: Optional auth middleware (for public routes with optional user data)
export const optionalAuthMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      req.user = null;
      return next();
    }

    const token = authHeader.substring(7).trim();
    
    if (!token || token === "null" || token === "undefined") {
      req.user = null;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await findUserById(decoded.id);
    
    req.user = user && user.isActive ? user : null;
    return next();
    
  } catch (error) {
    req.user = null;
    return next();
  }
};