import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Register from "../features/auth/pages/Register.jsx";
import Login from "../features/auth/pages/Login.jsx";
import { useSelector } from "react-redux";
import LearnerDashboard from "../features/dashboard/pages/LearnerDashboard.jsx";
import AdminDashboard from "../features/dashboard/pages/AdminDashboard.jsx";
import LearnerProfile from "../features/dashboard/pages/LearnerProfile.jsx";

const Spinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
  </div>
);

const Private = ({ children, roles = [] }) => {
  const { user, token, loading } = useSelector((state) => state.auth);

  if (loading) return <Spinner />;

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      {/* Learner Dashboard */}
      <Route
        path="/dashboard/learner"
        element={
          <Private roles={["learner", "admin", "super-admin"]}>
            <LearnerDashboard />
          </Private>
        }
      />

      {/* Admin Dashboard */}
      <Route
        path="/dashboard/admin"
        element={
          <Private roles={["admin", "super-admin"]}>
            <AdminDashboard />
          </Private>
        }
      />

      {/* Profile */}
      <Route
        path="/learner/profile"
        element={
          <Private roles={["learner", "admin", "super-admin"]}>
            <LearnerProfile />
          </Private>
        }
      />

      {/* 404 fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
