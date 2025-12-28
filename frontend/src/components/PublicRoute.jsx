import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { navigateToDashboard } from "../utils/navigation";

const PublicRoute = ({ children }) => {
  const { user, token, loading } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }


  if (user && token) {
    navigateToDashboard(user, navigate);
    return null;
  }

  return children;
};

export default PublicRoute;