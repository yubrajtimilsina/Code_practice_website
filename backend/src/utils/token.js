import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "20d";

// ✅ CRITICAL FIX: Add validation
if (!JWT_SECRET) {
  console.error("❌ FATAL ERROR: JWT_SECRET is not defined in environment variables!");
  process.exit(1);
}

const generateToken = (id) => {
  try {
    // ✅ CRITICAL FIX: Validate input
    if (!id) {
      throw new Error("User ID is required for token generation");
    }

    // ✅ Generate token with proper error handling
    const token = jwt.sign(
      { id: id.toString() }, // Ensure ID is string
      JWT_SECRET,
      { 
        expiresIn: JWT_EXPIRES_IN,
        issuer: 'codepractice-backend', // Add issuer for security
        audience: 'codepractice-users'   // Add audience for security
      }
    );

    console.log(`✅ Token generated successfully for user: ${id}`);
    return token;
    
  } catch (error) {
    console.error("❌ Token generation error:", error.message);
    throw new Error("Failed to generate authentication token");
  }
};

// ✅ NEW: Token verification utility
export const verifyToken = (token) => {
  try {
    if (!token) {
      throw new Error("No token provided");
    }

    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'codepractice-backend',
      audience: 'codepractice-users'
    });

    return decoded;
    
  } catch (error) {
    console.error("❌ Token verification error:", error.message);
    
    // Handle specific JWT errors
    if (error.name === 'TokenExpiredError') {
      throw new Error("Token has expired. Please login again.");
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error("Invalid token. Please login again.");
    }
    
    throw new Error("Token verification failed");
  }
};

// ✅ NEW: Token refresh utility
export const refreshToken = (oldToken) => {
  try {
    const decoded = verifyToken(oldToken);
    return generateToken(decoded.id);
  } catch (error) {
    throw new Error("Cannot refresh expired or invalid token");
  }
};

export default generateToken;