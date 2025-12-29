import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { logout } from "../features/auth/slice/authSlice.js";
import { LogOut, User, Shield, LayoutDashboard, Code2, Settings, MessageSquare, Trophy, TrendingUp, Terminal } from "lucide-react";

export default function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const getNavLinkClasses = (colorClass) => {
    return `flex items-center gap-2 px-4 py-2 ${colorClass} text-white rounded-lg transition-colors`;
  };

  if (!user) return null;

  const isAdmin = user.role === 'admin' || user.role === 'super-admin';
  const isLearner = user.role === 'learner';

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          CodePractice
        </Link>

        <div className="flex items-center gap-6">
          {/* ROLE BADGE */}
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
            className={getNavLinkClasses("bg-blue-500 hover:bg-blue-600")}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>

          {/* Learner-Only Links */}
          {isLearner && (
            <>
              <Link
                to="/problems"
                className={getNavLinkClasses("bg-green-500 hover:bg-green-600")}
              >
                <Code2 className="w-4 h-4" />
                Problems
              </Link>

              {/* ✅ NEW - Playground Link */}
              <Link
                to="/playground"
                className={getNavLinkClasses("bg-purple-500 hover:bg-purple-600")}
              >
                <Terminal className="w-4 h-4" />
                Playground
              </Link>

              <Link
                to="/discussion"
                className={getNavLinkClasses("bg-indigo-500 hover:bg-indigo-600")}
              >
                <MessageSquare className="w-4 h-4" />
                Discussion
              </Link>
            </>
          )}

          {/* Admin/Super Admin Links */}
          {isAdmin && (
            <>
              <Link
                to="/admin/problems"
                className={getNavLinkClasses("bg-purple-500 hover:bg-purple-600")}
              >
                <Settings className="w-4 h-4" />
                Manage
              </Link>

              {/* ✅ Admins can also access playground */}
              <Link
                to="/playground"
                className={getNavLinkClasses("bg-orange-500 hover:bg-orange-600")}
              >
                <Terminal className="w-4 h-4" />
                Playground
              </Link>
            </>
          )}

          {isLearner && (
            <Link
              to="/learner/profile"
              className={getNavLinkClasses("bg-slate-500 hover:bg-slate-600")}
            >
              <User className="w-4 h-4" />
              Profile
            </Link>
          )}

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            className={getNavLinkClasses("bg-red-500 hover:bg-red-600")}
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}