import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const Spinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
      <p className="text-purple-200 text-lg">Loading...</p>
    </div>
  </div>
);

const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const { user, token, loading } = useSelector((state) => state.auth);

  
  if (loading) {
    return <Spinner />;
  }

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  
  if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;