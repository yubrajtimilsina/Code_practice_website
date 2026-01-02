import { useState, useEffect } from "react";
import api from "../../../../utils/api.js";
import Pagination from "../../../../components/Pagination.jsx";
import { Users } from "lucide-react";

export default function UserManagement({ refreshing, setRefreshing }) {
  const [users, setUsers] = useState([]);
  const [userPage, setUserPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch users from backend
  const fetchUsers = async (page = 1) => {
    try {
      setLoading(true);
      const res = await api.get("/users", {
        params: { page, limit: usersPerPage },
      });

      const fetchedUsers = res.data.users || [];
      const total = res.data.pagination?.total || res.data.total || 0;

      setUsers(fetchedUsers);
      setTotalUsers(total);

      // If current page exceeds total pages (after deletion), go back
      const totalPages = Math.ceil(total / usersPerPage) || 1;
      if (page > totalPages) setUserPage(totalPages);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setUsers([]);
      setTotalUsers(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(userPage);
  }, [userPage]);

  // Block / Unblock user
  const handleBlockUser = async (id) => {
    try {
      setRefreshing(true);
      await api.post(`/users/${id}/toggle-block`);
      fetchUsers(userPage);
    } catch (err) {
      console.error("Failed to block/unblock user:", err);
    } finally {
      setRefreshing(false);
    }
  };

  // Delete user
  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      setRefreshing(true);
      await api.delete(`/users/${id}`);
      fetchUsers(userPage);
    } catch (err) {
      console.error("Failed to delete user:", err);
    } finally {
      setRefreshing(false);
    }
  };

  const totalPages = Math.ceil(totalUsers / usersPerPage) || 1;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Users className="w-6 h-6 text-blue-600" />
          User Management
        </h2>
        <span className="text-slate-500 text-sm">Total: {totalUsers}</span>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500">Loading users...</div>
      ) : users.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="pb-4 text-slate-600 text-left font-semibold">Name</th>
                  <th className="pb-4 text-slate-600 text-left font-semibold">Email</th>
                  <th className="pb-4 text-slate-600 text-left font-semibold">Role</th>
                  <th className="pb-4 text-slate-600 text-left font-semibold">Status</th>
                  <th className="pb-4 text-slate-600 text-left font-semibold">Joined</th>
                  <th className="pb-4 text-slate-600 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-4 text-slate-900 font-medium">{user.name}</td>
                    <td className="py-4 text-slate-600">{user.email}</td>
                    <td className="py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.role === "admin"
                            ? "bg-red-100 text-red-700"
                            : user.role === "super-admin"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}
                      >
                        {user.isActive ? "Active" : "Blocked"}
                      </span>
                    </td>
                    <td className="py-4 text-slate-600 text-sm">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleBlockUser(user._id)}
                          disabled={refreshing}
                          className={`px-3 py-1 text-sm rounded-md font-medium ${
                            user.isActive
                              ? "bg-orange-100 text-orange-700 hover:bg-orange-200"
                              : "bg-green-100 text-green-700 hover:bg-green-200"
                          }`}
                        >
                          {user.isActive ? "Block" : "Unblock"}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          disabled={refreshing}
                          className="px-3 py-1 text-sm rounded-md font-medium bg-red-100 text-red-700 hover:bg-red-200"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
  currentPage={userPage}
  totalPages={Math.ceil(totalUsers / usersPerPage)}
  totalItems={totalUsers}
  itemsPerPage={usersPerPage}
  onPageChange={setUserPage}
/>
        </>
      ) : (
        <div className="text-center py-12 text-slate-500">No users found</div>
      )}
    </div>
  );
}
