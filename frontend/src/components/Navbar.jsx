import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { logout } from "../features/auth/slice/authSlice.js";
import { LogOut, User, Shield, LayoutDashboard, Code2, Settings, MessageSquare } from "lucide-react";

export default function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  if (!user) return null;

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          CodePractice
        </Link>

        <div className="flex items-center gap-6">

          {/* ROLE */}
          <div className="flex items-center gap-2 text-slate-600">
            <Shield className="w-4 h-4" />
            <span className="text-sm font-semibold">
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </span>
          </div>

          {/* Dashboard Link */}
          <Link
            to={
              user.role === "super-admin"
                ? "/dashboard/super-admin"
                : user.role === "admin"
                  ? "/dashboard/admin"
                  : "/dashboard/learner"
            }
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>

          {/* Problems Link */}
          {user.role === "learner" && (
            <Link
              to="/problems"
              className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
            >
              <Code2 className="w-4 h-4" />
              Problems
            </Link>
          )}

          {user.role === "learner" && (
  <Link
    to="/discussion"
    className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
  >
    <MessageSquare className="w-4 h-4" />
    Discussion
  </Link>
)}


          {/* Admin / Super Admin Only */}
          {(user.role === "admin" || user.role === "super-admin") && (
            <Link
              to="/admin/problems"
              className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
            >
              <Settings className="w-4 h-4" />
              Manage
            </Link>
          )}

          {/* Profile (only learner) */}
          {user.role === "learner" && (
            <Link
              to="/learner/profile"
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              <User className="w-4 h-4" />
              Profile
            </Link>
          )}

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
