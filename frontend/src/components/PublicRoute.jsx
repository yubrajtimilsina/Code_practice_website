import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const { user, token, loading } = useSelector((state) => state.auth);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // Already logged in, redirect to appropriate dashboard
  if (user && token) {
    if (user.role === "super-admin") {
      return <Navigate to="/dashboard/super-admin" replace />;
    } else if (user.role === "admin") {
      return <Navigate to="/dashboard/admin" replace />;
    } else {
      return <Navigate to="/dashboard/learner" replace />;
    }
  }

  return children;
};

export default PublicRoute;