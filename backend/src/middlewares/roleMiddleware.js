
export const role = (...allowedRoles) => {
    return (req, res, next) => {
      if(! req.user ) {
        return res.status(401).json({ error : "Unauthorized"});
      }
     if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Access denied. Insufficient permissions" });
    }
    next();
  };
};

export const isSuperAdmin = role("super-admin");

export const isAdmin = role("admin", "super-admin");

export const isLearner = role("learner");
