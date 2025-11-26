import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Register from "../features/auth/pages/Register.jsx";
import Login from "../features/auth/pages/Login.jsx";
import Unauthorized from "../pages/Unauthorized.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import PublicRoute from "../components/PublicRoute.jsx";
import LearnerDashboard from "../features/dashboard/pages/LearnerDashboard.jsx";
import AdminDashboard from "../features/dashboard/pages/AdminDashboard.jsx";
import SuperAdminDashboard from "../features/dashboard/pages/SuperAdminDashboard.jsx";
import LearnerProfile from "../features/dashboard/pages/LearnerProfile.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes - Accessible by everyone */}
      <Route path="/" element={<Home />} />
      
      {/* Auth Routes - Only accessible when not logged in */}
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      {/* Protected Routes - Learner Dashboard */}
      <Route
        path="/dashboard/learner"
        element={
          <ProtectedRoute requiredRoles={["learner", "admin", "super-admin"]}>
            <LearnerDashboard />
          </ProtectedRoute>
        }
      />

      {/* Protected Routes - Admin Dashboard */}
      <Route
        path="/dashboard/admin"
        element={
          <ProtectedRoute requiredRoles={["admin", "super-admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Protected Routes - Super Admin Dashboard */}
      <Route
        path="/dashboard/super-admin"
        element={
          <ProtectedRoute requiredRoles={["super-admin"]}>
            <SuperAdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Protected Routes - Learner Profile */}
      <Route
        path="/learner/profile"
        element={
          <ProtectedRoute requiredRoles={["learner", "admin", "super-admin"]}>
            <LearnerProfile />
          </ProtectedRoute>
        }
      />

      {/* Access Denied Page */}
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* 404 Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}