import { useEffect, useState } from "react";
import { getAdminDashboardApi } from "../api/dashboardApi";

export default function AdminDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    getAdminDashboardApi().then(res => {
      setData(res.data);
    });
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p className="mt-2 text-gray-700">Welcome, {data.user.name}</p>

      <div className="mt-6 p-4 bg-gray-100 rounded shadow">
        <h2 className="text-xl font-semibold">System Stats</h2>
        <p>Total Users: {data.dashboard.stats.totalUsers}</p>
        <p>Total Problems: {data.dashboard.stats.totalProblems}</p>
        <p>Total Submissions: {data.dashboard.stats.totalSubmissions}</p>
      </div>
    </div>
  );
}
