import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

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

  
  if (loading) {
    return <Spinner />;
  }

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  
  if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
    const redirectPath =
      user.role === "admin"
        ? "/dashboard/admin"
        : user.role === "learner"
        ? "/dashboard/learner"
        : "/login"; 

    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default ProtectedRoute;