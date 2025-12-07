import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAdminDashboardApi, blockUserApi, deleteUserApi } from "../api/dashboardApi.js";
import api from "../../../utils/api.js";
import {
  Users,
  Code2,
  GitBranch,
  BarChart3,
  TrendingUp,
  AlertCircle,
  RefreshCw,
  UserCheck,
  FileText,
} from "lucide-react";

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user: currentUser } = useSelector((state) => state.auth);

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true);
      setError(null);

      const dashRes = await getAdminDashboardApi();
      setData(dashRes.data);

      console.log("Dashboard data:", dashRes.data);
      try {
        const usersRes = await api.get("/users/all");
        console.log("Users data:", usersRes.data);
        setUsers(usersRes.data || []);
      } catch (err) {
        console.warn("Could not fetch users:", err.message);
        setUsers([]);
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(err.response?.data?.error || "Failed to load dashboard data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };


  useEffect(() => {
    fetchDashboardData();
  }, []);



  const handleRefresh = () => {
    fetchDashboardData();
  };

  const handleBlockUser = async (userId) => {
    if (!confirm("Are you sure you want to block this user?")) return;
    try {
      setRefreshing(true);
      await blockUserApi(userId);
      fetchDashboardData(); // Re-fetch data to update the user list
    } catch (err) {
      console.error("Error blocking user:", err);
      setError(err.response?.data?.error || "Failed to block user");
    } finally {
      setRefreshing(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm("Are you sure you want to permanently delete this user?")) return;
    try {
      setRefreshing(true);
      await deleteUserApi(userId);
      fetchDashboardData(); 
    } catch (err) {
      console.error("Error deleting user:", err);
      setError(err.response?.data?.error || "Failed to delete user");
    } finally {
      setRefreshing(false);
    }
  };

   const BG_GRADIENT =
    "bg-gradient-to-br from-blue-50 via-white to-blue-100";

  const CARD_BASE =
    "bg-white border border-blue-200 shadow-md hover:shadow-xl";

  const CARD_HOVER =
    "transition-all duration-300 hover:border-blue-500";

  const TEXT_TITLE = "text-slate-800";
  const TEXT_SUB = "text-slate-500"

  
    if (loading) {
    return (
      <div className={`${BG_GRADIENT} min-h-screen flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-700 text-lg font-medium">
            Loading Admin Dashboard...
          </p>
        </div>
      </div>
    );
  }

    if (error && !data) {
    return (
      <div className={`${BG_GRADIENT} min-h-screen p-6`}>
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-100 border border-red-300 rounded-lg p-6 flex items-center gap-4">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <div>
              <p className="text-red-700 font-semibold">Error Loading Dashboard</p>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
            <button
              onClick={handleRefresh}
              className="ml-auto px-4 py-2 bg-red-200 hover:bg-red-300 text-red-700 rounded"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }


    if (!data) {
    return (
      <div className={`${BG_GRADIENT} min-h-screen p-6`}>
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-blue-600 text-lg">No dashboard data available</p>
        </div>
      </div>
    );
  }


  const stats = data?.dashboard?.stats || {
    totalUsers: 0,
    totalProblems: 0,
    totalSubmissions: 0,
  };

  return (
    <div className={`${BG_GRADIENT} min-h-screen p-6`}>
      <div className="max-w-7xl mx-auto">
     
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="w-8 h-8 text-blue-600" />
              <h1 className="text-4xl font-bold text-slate-900">
                Admin Dashboard
              </h1>
            </div>
            <p className="text-slate-600">
              Welcome back, <span className="font-semibold">{currentUser?.name}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg disabled:opacity-50"
              title="Refresh data"
            >
              <RefreshCw className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`} />
              {!refreshing && "Refresh"}
            </button>

             
          </div>
        </div>


        {error && (
          <div className="mb-6 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
            <p className="text-yellow-200 text-sm">{error}</p>
          </div>
        )}

    
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

          {/* USERS */}
          <div className={`${CARD_BASE} ${CARD_HOVER} rounded-2xl p-6`}>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-600 text-white rounded-lg">
                <Users className="w-6 h-6" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className={`${TEXT_SUB} text-sm font-medium`}>Total Users</p>
            <p className="text-4xl font-bold text-slate-900 mt-2">
              {stats.totalUsers}
            </p>
            <p className="text-xs text-slate-500 mt-2">Active accounts</p>
          </div>

          {/* PROBLEMS */}
           <div
        onClick={() => navigate("/problems")}
        className={`${CARD_BASE} ${CARD_HOVER} rounded-2xl p-6 cursor-pointer transition-all`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-blue-500 text-white rounded-lg">
            <Code2 className="w-6 h-6" />
          </div>
          <TrendingUp className="w-5 h-5 text-green-500" />
        </div>

        <p className={`${TEXT_SUB} text-sm font-medium`}>Total Problems</p>

        <p className="text-4xl font-bold text-slate-900 mt-2">
          {stats.totalProblems}
        </p>

        <p className="text-xs text-slate-500 mt-2">Listed problems</p>
      </div>

            {/* SUBMISSIONS */}
          <div className={`${CARD_BASE} ${CARD_HOVER} rounded-2xl p-6`}>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-400 text-white rounded-lg">
                <FileText className="w-6 h-6" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className={`${TEXT_SUB} text-sm font-medium`}>Total Submissions</p>
            <p className="text-4xl font-bold text-slate-900 mt-2">
              {stats.totalSubmissions}
            </p>
            <p className="text-xs text-slate-500 mt-2">User attempts</p>
          </div>

           {/* Active Users */}
          <div className={`${CARD_BASE} ${CARD_HOVER} rounded-2xl p-6`}>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500 text-white rounded-lg">
                <UserCheck className="w-6 h-6" />
              </div>
            </div>
            <p className={`${TEXT_SUB} text-sm font-medium`}>Active Users</p>
            <p className="text-4xl font-bold text-slate-900 mt-2">
              {users.filter((u) => u.isActive)?.length || 0}
            </p>
            <p className="text-xs text-slate-500 mt-2">Currently active</p>
          </div>
        </div>

        {/* Quick Actions */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

  {/* Manage Problems */}
<div
  onClick={() => navigate("/admin/problems")}
  className={`${CARD_BASE} ${CARD_HOVER} rounded-2xl p-6 cursor-pointer transition-all`}
>
  <div className="flex items-center justify-between mb-4">
    <div className="p-3 bg-blue-500 text-white rounded-lg">
      <Code2 className="w-6 h-6" />
    </div>
  </div>

  <p className={`${TEXT_SUB} text-sm font-medium`}>Manage Problems</p>
  <p className="text-2xl font-bold text-slate-900 mt-2">Create & Edit</p>
  <p className="text-xs text-slate-500 mt-2">Manage all coding questions</p>
</div>


  {/* User Management */}
  <div className={`${CARD_BASE} ${CARD_HOVER} rounded-2xl p-6 cursor-pointer transition-all`}>
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 bg-purple-500 text-white rounded-lg">
        <Users className="w-6 h-6" />
      </div>
    </div>
    <p className={`${TEXT_SUB} text-sm font-medium`}>User Management</p>
    <p className="text-2xl font-bold text-slate-900 mt-2">All Users</p>
    <p className="text-xs text-slate-500 mt-2">View, block, delete users</p>
  </div>

  {/* View Analytics */}
  <div className={`${CARD_BASE} ${CARD_HOVER} rounded-2xl p-6 cursor-pointer transition-all`}>
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 bg-pink-500 text-white rounded-lg">
        <BarChart3 className="w-6 h-6" />
      </div>
    </div>
    <p className={`${TEXT_SUB} text-sm font-medium`}>View Analytics</p>
    <p className="text-2xl font-bold text-slate-900 mt-2">Insights</p>
    <p className="text-xs text-slate-500 mt-2">Track platform performance</p>
  </div>

</div>


         {/* RECENT USERS TABLE */}
        <div className={`${CARD_BASE} rounded-2xl p-6`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-600" />
              Recent Users
            </h2>
            <span className="text-slate-500 text-sm">Total: {users.length}</span>
          </div>

          {users.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="pb-4 text-slate-600">Name</th>
                    <th className="pb-4 text-slate-600">Email</th>
                    <th className="pb-4 text-slate-600">Role</th>
                    <th className="pb-4 text-slate-600">Status</th>
                    <th className="pb-4 text-slate-600">Joined</th>
                    <th className="pb-4 text-slate-600">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {users.slice(0, 10).map((userItem, idx) => (
                    <tr key={idx} className="border-b border-slate-100">
                      <td className="py-4 text-slate-900 font-medium">
                        {userItem.name}
                      </td>
                      <td className="py-4 text-slate-600">{userItem.email}</td>
                      <td className="py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            userItem.role === "admin"
                              ? "bg-red-100 text-red-700"
                              : userItem.role === "super-admin"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {userItem.role}
                        </span>
                      </td>

                      <td className="py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            userItem.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {userItem.isActive ? "Active" : "Blocked"}
                        </span>
                      </td>

                      <td className="py-4 text-slate-500">
                        {new Date(userItem.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 text-right flex gap-2 justify-end items-center">
                        <button
                          onClick={() => handleBlockUser(userItem._id)}
                          disabled={refreshing || !userItem.isActive}
                          className={`px-3 py-1 text-sm rounded-md font-medium ${userItem.isActive ? 'bg-orange-100 text-orange-700 hover:bg-orange-200' : 'bg-slate-100 text-slate-500 cursor-not-allowed'}`}
                        >
                          {userItem.isActive ? "Block" : "Blocked"}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(userItem._id)}
                          disabled={refreshing}
                          className="px-3 py-1 text-sm rounded-md font-medium bg-red-100 text-red-700 hover:bg-red-200"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500">
              No users found
            </div>
          )}
        </div>
      

      
      </div>
    </div>
  );
}