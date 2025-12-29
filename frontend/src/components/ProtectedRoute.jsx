import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const Spinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-100">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-blue-700 text-lg">Loading...</p>
    </div>
  </div>
);

const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const { user, token, loading } = useSelector((state) => state.auth);
  const location = useLocation();

  if (loading) {
    return <Spinner />;
  }

  if (!user || !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.includes(user.role);
    
    if (!hasRequiredRole) {
      const redirectPath = getDashboardPath(user.role);
      return <Navigate to={redirectPath} replace />;
    }
  }

  return children;
};

const getDashboardPath = (role) => {
  switch (role) {
    case "super-admin":
      return "/dashboard/super-admin";
    case "admin":
      return "/dashboard/admin";
    case "learner":
      return "/dashboard/learner";
    default:
      return "/login";
  }
};

export default ProtectedRoute;