import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Register from "../features/auth/pages/Register.jsx";
import Login from "../features/auth/pages/Login.jsx";
import { useSelector } from "react-redux";
import LearnerDashboard from "../features/dashboard/pages/LearnerDashboard.jsx";
import AdminDashboard from "../features/dashboard/pages/AdminDashboard.jsx";

const Private = ({ children }) => {
  const token = useSelector((state) => state.auth.token);
  return token ? children : <Navigate to="/login" />;
};



export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path= "/dashboard/learner" element={
        <Private>
          <LearnerDashboard />
        </Private>
      } />
      <Route path= "/dashboard/admin" element={
        <Private roles={["admin"]}>
          <AdminDashboard />
        </Private>
      } />
    </Routes>
  );
};

