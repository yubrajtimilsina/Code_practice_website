
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

export const isSuperAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  if (req.user.role !== "super-admin") {
    return res.status(403).json({ error: "Super Admin access required" });
  }
  next();
};

export const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  if (!["admin", "super-admin"].includes(req.user.role)) {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};

export const isLearner = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  if (req.user.role !== "learner") {
    return res.status(403).json({ error: "Learner access required" });
  }
  next();
};
