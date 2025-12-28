export const navigateToDashboard = (user, navigate) => {
  if (!user || !navigate) return;

  if (user.role === "super-admin") {
    navigate("/dashboard/super-admin");
  } else if (user.role === "admin") {
    navigate("/dashboard/admin");
  } else if (user.role === "learner") {
    navigate("/dashboard/learner");
  }
};

