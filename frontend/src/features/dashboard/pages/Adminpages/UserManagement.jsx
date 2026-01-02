import { useState, useEffect } from "react";
import api from '../../../../utils/api';
import Pagination from "../../../../components/Pagination.jsx";
import { Users, Shield, Search, Filter, ChevronDown, AlertCircle, RefreshCw } from "lucide-react";
import { TableSkeleton } from "../../../../core/Skeleton.jsx";
import AlertModal from "../../../../components/AlertModal.jsx";
import { useAlert } from "../../../../hooks/useAlert.js";

export default function UserManagement({ 
  isAdmin = true, 
  showRoleManagement = false 
}) {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(20);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  // Filters
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  
  const { alert, showSuccess, showError, showConfirm, hideAlert } = useAlert();

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage, roleFilter, statusFilter]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== "") {
        setCurrentPage(1);
        fetchUsers(1);
      } else if (searchQuery === "" && currentPage === 1) {
        fetchUsers(1);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchUsers = async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: usersPerPage,
      };

      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (roleFilter !== "all") params.role = roleFilter;
      if (statusFilter !== "all") params.status = statusFilter;

      const endpoint = showRoleManagement ? "/super-admin/users" : "/users";
      const res = await api.get(endpoint, { params });

      const fetchedUsers = res.data.users || [];
      const total = res.data.pagination?.total || res.data.total || 0;

      setUsers(fetchedUsers);
      setTotalUsers(total);

      // Adjust page if needed
      const totalPages = Math.ceil(total / usersPerPage) || 1;
      if (page > totalPages) setCurrentPage(totalPages);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      showError(err.response?.data?.error || "Failed to fetch users");
      setUsers([]);
      setTotalUsers(0);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUser = async (id) => {
    const user = users.find(u => u._id === id);
    const action = user?.isActive ? "block" : "unblock";
    
    showConfirm(
      `Are you sure you want to ${action} this user?`,
      async () => {
        try {
          setRefreshing(true);
          await api.post(`/users/${id}/toggle-block`);
          showSuccess(`User ${action}ed successfully`);
          fetchUsers(currentPage);
        } catch (err) {
          showError(err.response?.data?.error || `Failed to ${action} user`);
        } finally {
          setRefreshing(false);
        }
      }
    );
  };

  const handleDeleteUser = async (id) => {
    showConfirm(
      "⚠️ This will permanently delete the user. Continue?",
      async () => {
        try {
          setRefreshing(true);
          await api.delete(`/users/${id}`);
          showSuccess("User deleted successfully");
          
          // If last user on page, go to previous page
          if (users.length === 1 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
          } else {
            fetchUsers(currentPage);
          }
        } catch (err) {
          showError(err.response?.data?.error || "Failed to delete user");
        } finally {
          setRefreshing(false);
        }
      }
    );
  };

  const handleSetAdmin = async (id) => {
    showConfirm(
      "Make this user an admin?",
      async () => {
        try {
          setRefreshing(true);
          await api.put(`/super-admin/${id}/set-admin`);
          showSuccess("User promoted to admin");
          fetchUsers(currentPage);
        } catch (err) {
          showError(err.response?.data?.error || "Failed to promote user");
        } finally {
          setRefreshing(false);
        }
      }
    );
  };

  const handleRevokeAdmin = async (id) => {
    showConfirm(
      "Revoke admin privileges from this user?",
      async () => {
        try {
          setRefreshing(true);
          await api.put(`/super-admin/${id}/revoke-admin`);
          showSuccess("Admin privileges revoked");
          fetchUsers(currentPage);
        } catch (err) {
          showError(err.response?.data?.error || "Failed to revoke admin");
        } finally {
          setRefreshing(false);
        }
      }
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setRoleFilter("all");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalUsers / usersPerPage) || 1;

  return (
    <>
      <AlertModal {...alert} onClose={hideAlert} />
      
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">
        {/* Header */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-slate-900">User Management</h2>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg transition-colors"
              >
                <Filter className="w-5 h-5" />
                Filters
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
              <button
                onClick={() => fetchUsers(currentPage)}
                disabled={loading || refreshing}
                className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 ${(loading || refreshing) ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 text-sm">Total: {totalUsers} users</span>
            {(searchQuery || roleFilter !== "all" || statusFilter !== "all") && (
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="p-6 bg-slate-50 border-b border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Search Users
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name or email..."
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Role Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Filter by Role
                </label>
                <select
                  value={roleFilter}
                  onChange={(e) => {
                    setRoleFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Roles</option>
                  <option value="learner">Learners</option>
                  <option value="admin">Admins</option>
                  {showRoleManagement && <option value="super-admin">Super Admins</option>}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Filter by Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="blocked">Blocked</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          {loading && users.length === 0 ? (
            <TableSkeleton rows={10} columns={6} />
          ) : users.length > 0 ? (
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Role</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Joined</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-slate-900">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{user.email}</td>
                    <td className="px-6 py-4">
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
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {user.isActive ? "Active" : "Blocked"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-sm">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {/* Block/Unblock */}
                        <button
                          onClick={() => handleBlockUser(user._id)}
                          disabled={refreshing}
                          className={`px-3 py-1 text-sm rounded-md font-medium transition-colors ${
                            user.isActive
                              ? "bg-orange-100 text-orange-700 hover:bg-orange-200"
                              : "bg-green-100 text-green-700 hover:bg-green-200"
                          } disabled:opacity-50`}
                        >
                          {user.isActive ? "Block" : "Unblock"}
                        </button>

                        {/* Role Management (Super Admin only) */}
                        {showRoleManagement && (
                          <>
                            {user.role === "learner" && (
                              <button
                                onClick={() => handleSetAdmin(user._id)}
                                disabled={refreshing}
                                className="px-3 py-1 text-sm rounded-md font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 disabled:opacity-50 transition-colors"
                              >
                                Make Admin
                              </button>
                            )}
                            {user.role === "admin" && (
                              <button
                                onClick={() => handleRevokeAdmin(user._id)}
                                disabled={refreshing}
                                className="px-3 py-1 text-sm rounded-md font-medium bg-yellow-100 text-yellow-700 hover:bg-yellow-200 disabled:opacity-50 transition-colors"
                              >
                                Revoke Admin
                              </button>
                            )}
                          </>
                        )}

                        {/* Delete */}
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          disabled={refreshing}
                          className="px-3 py-1 text-sm rounded-md font-medium bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center text-slate-500">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="font-medium">No users found</p>
              {(searchQuery || roleFilter !== "all" || statusFilter !== "all") && (
                <p className="text-sm mt-2">Try adjusting your filters</p>
              )}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-6 border-t border-slate-200">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalUsers}
              itemsPerPage={usersPerPage}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </>
  );
}