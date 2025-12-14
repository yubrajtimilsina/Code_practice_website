import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Register from "../features/auth/pages/Register.jsx";
import Login from "../features/auth/pages/Login.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import PublicRoute from "../components/PublicRoute.jsx";
import LearnerDashboard from "../features/dashboard/pages/LearnerDashboard.jsx";
import AdminDashboard from "../features/dashboard/pages/AdminDashboard.jsx";
import SuperAdminDashboard from "../features/dashboard/pages/SuperAdminDashboard.jsx";
import LearnerProfile from "../features/dashboard/pages/LearnerProfile.jsx";
import AdminProblemForm from "../features/problems/pages/AdminProblemForm.jsx";
import ProblemDetails from "../features/problems/pages/ProblemDetails.jsx";
import ProblemList from "../features/problems/pages/ProblemList.jsx";
import CodeEditor from "../features/problems/components/CodeEditor.jsx";
import SubmissionHistory from "../features/problems/pages/SubmissionHistory.jsx";
import SubmissionDetails from "../features/problems/pages/SubmissionDetails.jsx";

import Leaderboard from "../features/leaderboard/pages/leaderboard.jsx";
import Progress from "../features/leaderboard/pages/Progress.jsx";

export default function AppRoutes() {
  return (
    <Routes>

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


      <Route
        path="/dashboard/learner"
        element={
          <ProtectedRoute requiredRoles={["learner"]}>
            <LearnerDashboard />
          </ProtectedRoute>
        }
      />


      <Route
        path="/dashboard/admin"
        element={
          <ProtectedRoute requiredRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />


      <Route
        path="/dashboard/super-admin"
        element={
          <ProtectedRoute requiredRoles={["super-admin"]}>
            <SuperAdminDashboard />
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
        path="/problems"
        element={<ProblemList />}
      />
      <Route
        path="/problems/:id"
        element={<ProblemDetails />}
      />

      <Route
        path="/admin/problems"
        element={
          <ProtectedRoute requiredRoles={["admin"]}>
            <ProblemList adminView={true} />
          </ProtectedRoute>
        }
      />


      <Route
        path="/admin/problems/new"
        element={
          <ProtectedRoute requiredRoles={["admin"]}>
            <AdminProblemForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/problems/:id/edit"
        element={
          <ProtectedRoute requiredRoles={["admin"]}>
            <AdminProblemForm />
          </ProtectedRoute>
        }
      />

      <Route
        path="/editor/:problemId"
        element={
          <ProtectedRoute requiredRoles={["learner"]}>
            <CodeEditor />
          </ProtectedRoute>
        }
      />

      <Route
        path="/submissions"
        element={
          <ProtectedRoute requiredRoles={["learner"]}>
            <SubmissionHistory />
          </ProtectedRoute>
        }
      />
       <Route
        path="/submissions/:submissionId"
        element={
          <ProtectedRoute requiredRoles={["learner"]}>
            <SubmissionDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/leaderboard"
        element={
          <ProtectedRoute requiredRoles={["learner", "admin"]}>
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
      

      <Route path="/" element={<Navigate to="/" replace />} />
    </Routes>
  );
}