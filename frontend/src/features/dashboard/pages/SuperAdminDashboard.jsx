import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Shield, Users, Settings, LogOut, Activity, TrendingUp } from "lucide-react";
import { logout } from "../../auth/slice/authSlice.js";
import api from "../../../utils/api.js";

export default function SuperAdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [admins, setAdmins] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashRes = await api.get("/dashboard/admin");
        setData(dashRes.data);

     
        const adminsRes = await api.get("/super-admin/manage-admins");
        setAdmins(adminsRes.data.admins || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-purple-200">Loading Super Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-8 h-8 text-yellow-400" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Super Admin Dashboard
              </h1>
            </div>
            <p className="text-purple-200">
              Welcome back, <span className="font-semibold">{user?.name}</span>
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-700 text-white font-bold rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-6 h-6 text-blue-400" />
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-purple-200 text-sm">Total Users</p>
            <p className="text-3xl font-bold text-white mt-2">
              {data?.dashboard?.stats?.totalUsers || 0}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <Settings className="w-6 h-6 text-purple-400" />
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-purple-200 text-sm">Active Admins</p>
            <p className="text-3xl font-bold text-white mt-2">{admins.length}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <Activity className="w-6 h-6 text-pink-400" />
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-purple-200 text-sm">Total Problems</p>
            <p className="text-3xl font-bold text-white mt-2">
              {data?.dashboard?.stats?.totalProblems || 0}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <Shield className="w-6 h-6 text-yellow-400" />
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-purple-200 text-sm">System Health</p>
            <p className="text-3xl font-bold text-green-400 mt-2">100%</p>
          </div>
        </div>

        {/* Admins Management */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-400" />
            Admin Management
          </h2>

          {admins.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="pb-4 text-purple-200 font-semibold">Name</th>
                    <th className="pb-4 text-purple-200 font-semibold">Email</th>
                    <th className="pb-4 text-purple-200 font-semibold">Role</th>
                    <th className="pb-4 text-purple-200 font-semibold">Status</th>
                    <th className="pb-4 text-purple-200 font-semibold">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map((admin, idx) => (
                    <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition">
                      <td className="py-4 text-white">{admin.name}</td>
                      <td className="py-4 text-purple-200">{admin.email}</td>
                      <td className="py-4">
                        <span className="px-3 py-1 bg-blue-500/20 text-blue-200 rounded-full text-sm">
                          {admin.role}
                        </span>
                      </td>
                      <td className="py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            admin.isActive
                              ? "bg-green-500/20 text-green-200"
                              : "bg-red-500/20 text-red-200"
                          }`}
                        >
                          {admin.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-4 text-purple-200">
                        {new Date(admin.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-purple-200 text-center py-8">No admins found</p>
          )}
        </div>
      </div>
    </div>
  );
}