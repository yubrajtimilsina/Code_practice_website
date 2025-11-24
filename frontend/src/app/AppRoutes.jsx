import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Register from "../features/auth/pages/Register.jsx";
import Login from "../features/auth/pages/Login.jsx";
import { useSelector } from "react-redux";

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
      <Route
        path="/dashboard"
        element={
          <Private>
            <h1 className="text-3xl font-bold p-6 text-center text-green-800">Welcome to the Dashboard!</h1>
          </Private>
        }
      />
    </Routes>
  );
};

