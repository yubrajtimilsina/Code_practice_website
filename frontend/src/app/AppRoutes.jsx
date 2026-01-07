import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Home from "../pages/Home";
import Register from "../features/auth/pages/Register.jsx";
import Login from "../features/auth/pages/Login.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import PublicRoute from "../components/PublicRoute.jsx";
import DashboardLayout from "../layouts/DashboardLayout.jsx";

import LearnerDashboard from "../features/dashboard/pages/Learnerpages/LearnerDashboard.jsx";
import AdminDashboard from "../features/dashboard/pages/Adminpages/AdminDashboard.jsx";
import SuperAdminDashboard from "../features/dashboard/pages/SuperAdminpages/SuperAdminDashboard.jsx";
import LearnerProfile from "../features/dashboard/pages/Learnerpages/LearnerProfile.jsx";
import EditProfile from "../features/user/pages/EditProfile.jsx";
import AdminProfile from "../features/dashboard/pages/Adminpages/AdminProfile.jsx";
import SuperAdminManageUsers from "../features/dashboard/pages/SuperAdminpages/SuperAdminManagesUsers.jsx";
import SuperAdminProfile from "../features/dashboard/pages/SuperAdminpages/SuperAdminProfile.jsx";
import SystemSettings from "../features/dashboard/pages/SuperAdminpages/SystemSettings.jsx";


import AdminProblemForm from "../features/problems/pages/AdminProblemForm.jsx";
import ProblemDetails from "../features/problems/pages/ProblemDetails.jsx";
import ProblemList from "../features/problems/pages/ProblemList.jsx";
import CodeEditor from "../features/problems/components/CodeEditor.jsx";
import SubmissionHistory from "../features/problems/pages/SubmissionHistory.jsx";
import SubmissionDetails from "../features/problems/pages/SubmissionDetails.jsx";

import Leaderboard from "../features/leaderboard/pages/leaderboard.jsx";
import Progress from "../features/leaderboard/pages/Progress.jsx";

import DailyChallenge from "../features/dailyChallenge/pages/DailyChallenge.jsx";
import ChallengeHistory from "../features/dailyChallenge/pages/ChallengeHistory.jsx";
import ChallengeLeaderboard from "../features/dailyChallenge/pages/ChallengeLeaderboard.jsx";

import DiscussionList from "../features/discussion/pages/DiscussionList.jsx";
import CreateDiscussion from "../features/discussion/pages/CreateDiscussion.jsx";
import DiscussionDetails from "../features/discussion/pages/DiscussionDetails.jsx";
import Playground from "../features/playground/pages/Playground.jsx";
import UserManagement from "../features/dashboard/pages/Adminpages/UserManagement.jsx";
import TotalSubmissions from "../features/dashboard/pages/Adminpages/TotalSubmissions.jsx";

// Smart Dashboard Redirector Component
const DashboardRedirect = () => {
  const { user } = useSelector((state) => state.auth);

  if (!user) return <Navigate to="/login" replace />;

  switch (user.role) {
    case "super-admin":
      return <Navigate to="/dashboard/super-admin" replace />;
    case "admin":
      return <Navigate to="/dashboard/admin" replace />;
    case "learner":
      return <Navigate to="/dashboard/learner" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

export default function AppRoutes() {
  return (
    <Routes>
      {/* ========== PUBLIC ROUTES (No Sidebar) ========== */}
      <Route path="/" element={<Home />} />

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

      {/* ========== SMART DASHBOARD REDIRECT ========== */}
      <Route path="/dashboard" element={<DashboardRedirect />} />

      {/* ========== PROTECTED ROUTES WITH SIDEBAR LAYOUT ========== */}
      <Route
        element={
          <ProtectedRoute requiredRoles={["learner", "admin", "super-admin"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Learner Dashboard Routes */}
        <Route
          path="/dashboard/learner"
          element={
            <ProtectedRoute requiredRoles={["learner"]}>
              <LearnerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/learner/profile"
          element={
            <ProtectedRoute requiredRoles={["learner"]}>
              <LearnerProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/edit"
          element={
            <ProtectedRoute requiredRoles={["learner", "admin", "super-admin"]}>
              <EditProfile />
            </ProtectedRoute>
          }
        />

        {/* Admin Dashboard Routes */}
        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute requiredRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/problems"
          element={
            <ProtectedRoute requiredRoles={["admin", "super-admin"]}>
              <ProblemList adminView={true} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/problems/new"
          element={
            <ProtectedRoute requiredRoles={["admin", "super-admin"]}>
              <AdminProblemForm />
            </ProtectedRoute>
          }
        />




        <Route
          path="/admin/problems/:id/edit"
          element={
            <ProtectedRoute requiredRoles={["admin", "super-admin"]}>
              <AdminProblemForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedRoute requiredRoles={["admin"]}>
              <UserManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manage-users"
          element={
            <ProtectedRoute requiredRoles={["super-admin"]}>
              <SuperAdminManageUsers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/total-submissions"
          element={
            <ProtectedRoute requiredRoles={["admin", "super-admin"]}>
              <TotalSubmissions />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/profile"
          element={
            <ProtectedRoute requiredRoles={["admin"]}>
              <AdminProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/super-admin/profile"
          element={
            <ProtectedRoute requiredRoles={["super-admin"]}>
              <SuperAdminProfile />
            </ProtectedRoute>
          }
        />


        {/* Super Admin Dashboard Routes */}
        <Route
          path="/dashboard/super-admin"
          element={
            <ProtectedRoute requiredRoles={["super-admin"]}>
              <SuperAdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/super-admin/settings"
          element={
            <ProtectedRoute requiredRoles={["super-admin"]}>
              <SystemSettings />
            </ProtectedRoute>
          }
        />

        {/* Shared Routes (All roles with sidebar) */}
        <Route
          path="/problems"
          element={
            <ProtectedRoute requiredRoles={["learner", "admin", "super-admin"]}>
              <ProblemList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/playground"
          element={
            <ProtectedRoute requiredRoles={["learner", "admin", "super-admin"]}>
              <Playground />
            </ProtectedRoute>
          }
        />

        <Route
          path="/submissions"
          element={
            <ProtectedRoute requiredRoles={["learner", "admin", "super-admin"]}>
              <SubmissionHistory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/submissions/:submissionId"
          element={
            <ProtectedRoute requiredRoles={["learner", "admin", "super-admin"]}>
              <SubmissionDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/leaderboard"
          element={
            <ProtectedRoute requiredRoles={["learner", "admin", "super-admin"]}>
              <Leaderboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/progress"
          element={
            <ProtectedRoute requiredRoles={["learner"]}>
              <Progress />
            </ProtectedRoute>
          }
        />

        <Route
          path="/daily-challenge"
          element={
            <ProtectedRoute requiredRoles={["learner"]}>
              <DailyChallenge />
            </ProtectedRoute>
          }
        />

        <Route
          path="/daily-challenge/history"
          element={
            <ProtectedRoute requiredRoles={["learner"]}>
              <ChallengeHistory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/daily-challenge/leaderboard/:challengeId"
          element={
            <ProtectedRoute requiredRoles={["learner"]}>
              <ChallengeLeaderboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/discussion"
          element={
            <ProtectedRoute requiredRoles={["learner", "admin", "super-admin"]}>
              <DiscussionList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/discussion/new"
          element={
            <ProtectedRoute requiredRoles={["learner", "admin", "super-admin"]}>
              <CreateDiscussion />
            </ProtectedRoute>
          }
        />

        <Route
          path="/discussion/:id"
          element={
            <ProtectedRoute requiredRoles={["learner", "admin", "super-admin"]}>
              <DiscussionDetails />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* ========== ROUTES WITHOUT SIDEBAR (Full Screen) ========== */}
      <Route
        path="/problems/:id"
        element={
          <ProtectedRoute requiredRoles={["learner", "admin", "super-admin"]}>
            <ProblemDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/editor/:problemId"
        element={
          <ProtectedRoute requiredRoles={["learner", "admin", "super-admin"]}>
            <CodeEditor />
          </ProtectedRoute>
        }
      />

      {/* ========== FALLBACK - 404 ========== */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}