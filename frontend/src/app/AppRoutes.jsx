import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Register from "../features/auth/pages/Register.jsx";
import Login from "../features/auth/pages/Login.jsx";
import { useSelector } from "react-redux";
import LearnerDashboard from "../features/dashboard/pages/LearnerDashboard.jsx";
import AdminDashboard from "../features/dashboard/pages/AdminDashboard.jsx";
import LearnerProfile from "../features/dashboard/pages/LearnerProfile.jsx";
import { useEffect, useState } from "react";





const Private = ({ children, roles }) => {
  const { token, user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const { data: profile, isLoading } = useGetProfileQuery(undefined, {
    skip: !token || !!user,
  });

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    if (user || profile) {
      setLoading(false);
    } else if (!isLoading) {
      setLoading(false);
    }
  }, [token, user, profile, isLoading]);

  if (loading) {
    return <Spinner />;
  }

  if (!token) return <Navigate to="/login" />;

  const currentUser = user || profile?.user;

  if (roles && roles.length > 0) {
    if (!currentUser) return <Navigate to="/login" />; // ensure user loaded
    if (!roles.includes(currentUser.role)) return <Navigate to="/" />; // unauthorized
  }

  return children;
};



export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard/learner"
        element={
          <Private roles={["learner", "admin", "super-admin"]}>
            <LearnerDashboard />
          </Private>
        }
      />
      <Route
        path="/dashboard/admin"
        element={
          <Private roles={["admin", "super-admin"]}>
            <AdminDashboard />
          </Private>
        }
      />
      <Route
        path="/learner/profile"
        element={
          <Private roles={["learner", "admin", "super-admin"]}>
            <LearnerProfile />
          </Private>
        }
      />
    </Routes>
  );
};

