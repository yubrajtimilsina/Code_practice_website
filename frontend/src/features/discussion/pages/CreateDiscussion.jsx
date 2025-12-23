import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createDiscussion } from "../api/discussionApi.js";
import { ArrowLeft, AlertCircle } from "lucide-react";

export default function CreateDiscussion() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    content: "",
    category: "general",
    tags: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const categories = [
    { value: "general", label: "General Discussion" },
    { value: "problem-help", label: "Problem Help" },
    { value: "algorithm", label: "Algorithm Discussion" },
    { value: "interview", label: "Interview Preparation" },
    { value: "bug-report", label: "Bug Report" },
    { value: "feature-request", label: "Feature Request" }
  ];

   const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.title.trim() || !form.content.trim()) {
      setError("Title and content are required");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        ...form,
        tags: form.tags.split(",").map(t => t.trim()).filter(Boolean)
      };

      const response = await createDiscussion(payload);
      navigate(`/discussion/${response.data.discussion._id}`);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create discussion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate("/discussion")}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Forum
        </button>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
          <h1 className="text-3xl font-bold text-slate-900 mb-6">Create New Discussion</h1>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="What's your question or topic?"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Content <span className="text-red-500">*</span>
              </label>
              <textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder="Provide details about your question or topic..."
                rows={10}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Tags (optional)
              </label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                placeholder="arrays, strings, dynamic-programming (comma separated)"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate("/discussion")}
                className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Discussion"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}