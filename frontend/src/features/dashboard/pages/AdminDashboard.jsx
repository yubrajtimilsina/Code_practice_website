import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAdminDashboardApi } from "../api/dashboardApi";
import { logout } from '../../auth/slice/authSlice.js';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    getAdminDashboardApi().then(res => {
      setData(res.data);
    });
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  if (!data) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <div className="flex items-center justify-between">
        <p className="mt-2 text-gray-700">Welcome, {data.user.name}</p>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Logout
        </button>
      </div>

      <div className="mt-6 p-4 bg-gray-100 rounded shadow">
        <h2 className="text-xl font-semibold">System Stats</h2>
        <p>Total Users: {data.dashboard.stats.totalUsers}</p>
        <p>Total Problems: {data.dashboard.stats.totalProblems}</p>
        <p>Total Submissions: {data.dashboard.stats.totalSubmissions}</p>
      </div>
    </div>
  );
}
