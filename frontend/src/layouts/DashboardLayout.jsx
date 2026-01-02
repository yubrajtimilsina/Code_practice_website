import { useState } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/slice/authSlice";
import {
  LayoutDashboard,
  Code2,
  Trophy,
  TrendingUp,
  Calendar,
  MessageSquare,
  User,
  LogOut,
  Menu,
  X,
  Settings,
  Users,
  Shield,
  Terminal,
  BarChart3,
  Crown,
  FileText,
  Target
} from "lucide-react";

export default function DashboardLayout() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  // Role-based navigation items
  const getNavigationItems = () => {
    const role = user?.role;

    if (role === "super-admin") {
      return [
        { path: "/dashboard/super-admin", icon: Crown, label: "Super Admin Dashboard" },
        { path: "/admin/problems", icon: Code2, label: "Manage Problems" },
        { path: "/discussion", icon: MessageSquare, label: "Discussions" },
        { path: "/playground", icon: Terminal, label: "Playground" },
        { path: "/manage-users", icon: Users, label: "Manage Users" },

      ];
    }

    if (role === "admin") {
      return [
        { path: "/dashboard/admin", icon: LayoutDashboard, label: "Dashboard" },
        { path: "/admin/problems", icon: Settings, label: "Manage Problems" },
        { path: "/discussion", icon: MessageSquare, label: "Discussions" },
        { path: "/playground", icon: Terminal, label: "Playground" },
        { path: "/users", icon: Users, label: "Manage Users" },
      ];
    }

    // Learner navigation
    return [
      { path: "/dashboard/learner", icon: LayoutDashboard, label: "Dashboard" },
      { path: "/problems", icon: Code2, label: "Problems" },
      { path: "/playground", icon: Terminal, label: "Playground" },
      { path: "/daily-challenge", icon: Calendar, label: "Daily Challenge" },
      { path: "/leaderboard", icon: Trophy, label: "Leaderboard" },
      { path: "/progress", icon: TrendingUp, label: "My Progress" },
      { path: "/discussion", icon: MessageSquare, label: "Discussion" },
      { path: "/submissions", icon: FileText, label: "Submissions" },
    ];
  };

  const navigationItems = getNavigationItems();

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  const getRoleBadgeColor = (role) => {
    if (role === "super-admin") return "bg-yellow-100 text-yellow-700 border-yellow-300";
    if (role === "admin") return "bg-red-100 text-red-700 border-red-300";
    return "bg-blue-100 text-blue-700 border-blue-300";
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col bg-white border-r border-slate-200 transition-all duration-300 ${
          isSidebarOpen ? "w-64" : "w-20"
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          {isSidebarOpen && (
            <Link to="/" className="text-2xl font-bold text-blue-600">
              CodePractice
            </Link>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold flex-shrink-0">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            {isSidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 truncate">{user?.name}</p>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeColor(
                    user?.role
                  )}`}
                >
                  <Shield className="w-3 h-3" />
                  {user?.role}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                isActive(item.path)
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {isSidebarOpen && <span className="truncate">{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Profile & Logout */}
        <div className="p-4 border-t border-slate-200 space-y-1">
          {user?.role === "learner" && (
            <Link
              to="/learner/profile"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                isActive("/learner/profile")
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <User className="w-5 h-5 flex-shrink-0" />
              {isSidebarOpen && <span>Profile</span>}
            </Link>
          )}

          {user?.role === "admin" && (
  <Link
    to="/admin/profile"
    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
      isActive("/admin/profile")
        ? "bg-red-50 text-red-600 font-medium"
        : "text-slate-700 hover:bg-slate-50"
    }`}
  >
    <User className="w-5 h-5 flex-shrink-0" />
    {isSidebarOpen && <span>Profile</span>}
  </Link>
)}

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 md:hidden ${
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mobile Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            CodePractice
          </Link>
          <button
            onClick={() => setIsMobileSidebarOpen(false)}
            className="p-2 hover:bg-slate-100 rounded-lg"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Mobile User Info */}
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-slate-900">{user?.name}</p>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeColor(
                  user?.role
                )}`}
              >
                <Shield className="w-3 h-3" />
                {user?.role}
              </span>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                isActive(item.path)
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Mobile Profile & Logout */}
        <div className="p-4 border-t border-slate-200 space-y-1">
          {user?.role === "learner" && (
            <Link
              to="/learner/profile"
              onClick={() => setIsMobileSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                isActive("/learner/profile")
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <User className="w-5 h-5" />
              <span>Profile</span>
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Top Bar */}
        <header className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="p-2 hover:bg-slate-100 rounded-lg"
          >
            <Menu className="w-6 h-6 text-slate-600" />
          </button>
          <Link to="/" className="text-xl font-bold text-blue-600">
            CodePractice
          </Link>
          <div className="w-10" /> {/* Spacer for alignment */}
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}