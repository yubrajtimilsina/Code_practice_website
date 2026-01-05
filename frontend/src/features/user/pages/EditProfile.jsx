import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import api from "../../../utils/api";
import { getMe } from "../../auth/slice/authSlice";
import { User, Mail, Lock, Save, ArrowLeft, AlertCircle } from "lucide-react";
import { FormSkeleton } from "../../../core/Skeleton.jsx";

export default function EditProfile() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validate password change
    if (form.newPassword) {
      if (form.newPassword !== form.confirmPassword) {
        setError("New passwords do not match");
        return;
      }
      if (!form.currentPassword) {
        setError("Current password is required to change password");
        return;
      }
    }

    setLoading(true);

    try {
      const payload = {
        name: form.name,
        email: form.email
      };

      if (form.newPassword) {
        payload.currentPassword = form.currentPassword;
        payload.newPassword = form.newPassword;
      }

      await api.put("/users/profile", payload);

      setSuccess("Profile updated successfully!");

      // Refresh user data
      dispatch(getMe());

      // Clear password fields
      setForm({
        ...form,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });

      setTimeout(() => {
        if (user.role === 'admin') {
          navigate("/admin/profile");
        } else if (user.role === 'super-admin') {
          navigate("/super-admin/profile");
        } else {
          navigate("/learner/profile");
        }
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.error || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 p-6 md:p-8">
        <div className="max-w-2xl mx-auto">
          <FormSkeleton fields={6} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-8">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => {
            if (user?.role === 'admin') navigate("/admin/profile");
            else if (user?.role === 'super-admin') navigate("/super-admin/profile");
            else navigate("/learner/profile");
          }}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Profile
        </button>

        <div className="bg-white border border-slate-200 shadow-lg rounded-2xl p-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-6">Edit Profile</h1>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-100 border border-green-300 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-green-600" />
              <p className="text-green-700">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="border-t border-slate-200 pt-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Change Password (Optional)</h3>

              {/* Current Password */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Lock className="w-4 h-4 inline mr-2" />
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={form.currentPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter current password"
                />
              </div>

              {/* New Password */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={form.newPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter new password (min 6 characters)"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Re-enter new password"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={() => {
                  if (user?.role === 'admin') navigate("/admin/profile");
                  else if (user?.role === 'super-admin') navigate("/super-admin/profile");
                  else navigate("/learner/profile");
                }}
                className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}