export const role = (...allowedRoles) => {
  return (req, res, next) => {
    // Check if user exists
    if (!req.user) {
      console.error(" Role Check Failed: No user in request");
      return res.status(401).json({ 
        error: "Unauthorized",
        message: "Authentication required"
      });
    }

    // Check if user has required role
    if (!allowedRoles.includes(req.user.role)) {
      console.warn(`Access Denied: User ${req.user.email} (${req.user.role}) attempted to access route requiring [${allowedRoles.join(", ")}]`);
      
      return res.status(403).json({ 
        error: "Access denied",
        message: "Insufficient permissions for this action",
        requiredRoles: allowedRoles,
        userRole: req.user.role
      });
    }

  
    console.log(` Role Check Passed: ${req.user.email} (${req.user.role}) accessing ${req.path}`);
    next();
  };
};

export const isSuperAdmin = role("super-admin");
export const isAdmin = role("admin", "super-admin");
export const isLearner = role("learner");


export const strictRole = (exactRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (req.user.role !== exactRole) {
      console.warn(` Strict Role Violation: Expected ${exactRole}, got ${req.user.role}`);
      return res.status(403).json({ 
        error: "Access denied",
        message: `This action requires ${exactRole} privileges`
      });
    }

    next();
  };
};