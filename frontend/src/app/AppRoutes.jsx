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
import DailyChallenge from "../features/dailyChallenge/pages/DailyChallenge.jsx";
import ChallengeHistory from "../features/dailyChallenge/pages/ChallengeHistory.jsx";
import ChallengeLeaderboard from "../features/dailyChallenge/pages/ChallengeLeaderboard.jsx";

import DiscussionList from "../features/discussion/pages/DiscussionList.jsx";
import CreateDiscussion from "../features/discussion/pages/CreateDiscussion.jsx";
import DiscussionDetails from "../features/discussion/pages/DiscussionDetails.jsx";

function createProtectedRoute(path, element, roles) {
  return (
    <Route
      path={path}
      element={
        <ProtectedRoute requiredRoles={roles}>
          {element}
        </ProtectedRoute>
      }
    />
  );
}

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


      {createProtectedRoute("/dashboard/learner", <LearnerDashboard />, ["learner"])}


      {createProtectedRoute("/dashboard/admin", <AdminDashboard />, ["admin"])}


      {createProtectedRoute("/dashboard/super-admin", <SuperAdminDashboard />, ["super-admin"])}


      {createProtectedRoute("/learner/profile", <LearnerProfile />, ["learner"])}

      <Route
        path="/problems"
        element={<ProblemList />}
      />
      <Route
        path="/problems/:id"
        element={<ProblemDetails />}
      />

      {createProtectedRoute("/admin/problems", <ProblemList adminView={true} />, ["admin"])}


      {createProtectedRoute("/admin/problems/new", <AdminProblemForm />, ["admin"])}
      {createProtectedRoute("/admin/problems/:id/edit", <AdminProblemForm />, ["admin"])}

      {createProtectedRoute("/editor/:problemId", <CodeEditor />, ["learner"])}
      {createProtectedRoute("/submissions", <SubmissionHistory />, ["learner"])}
      {createProtectedRoute("/submissions/:submissionId", <SubmissionDetails />, ["learner"])}
      {createProtectedRoute("/leaderboard", <Leaderboard />, ["learner", "admin"])}
      {createProtectedRoute("/progress", <Progress />, ["learner"])}
      {createProtectedRoute("/daily-challenge", <DailyChallenge />, ["learner"])}
      {createProtectedRoute("/daily-challenge/history", <ChallengeHistory />, ["learner"])}
      {createProtectedRoute("/daily-challenge/leaderboard/:challengeId", <ChallengeLeaderboard />, ["learner"])}
      {createProtectedRoute("/discussion", <DiscussionList />, ["learner", "admin"])}
      {createProtectedRoute("/discussion/new", <CreateDiscussion />, ["learner", "admin"])}
      {createProtectedRoute("/discussion/:id", <DiscussionDetails />, ["learner", "admin"])}


    </Routes>
  );
}