import { useEffect, useState } from "react";
import { createProblem, getProblem, updateProblem, deleteProblem } from "../api/problemApi";
import { useNavigate, useParams } from "react-router-dom";

export default function AdminProblemForm() {
  const { id } = useParams(); // optional, when editing
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "", slug: "", description: "", difficulty: "easy", tags: "", sampleInput: "", sampleOutput: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      setLoading(true);
      getProblem(id).then(res => {
        const p = res.data;
        setForm({
          title: p.title || "",
          slug: p.slug || "",
          description: p.description || "",
          difficulty: p.difficulty || "easy",
          tags: (p.tags || []).join(","),
          sampleInput: p.sampleInput || "",
          sampleOutput: p.sampleOutput || ""
        });
      }).catch(console.error).finally(() => setLoading(false));
    }
  }, [id]);

  const onChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, tags: form.tags.split(",").map(t => t.trim()).filter(Boolean) };
      if (id) {
        await updateProblem(id, payload);
      } else {
        await createProblem(payload);
      }
      navigate("/admin/problems");
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  };

  const onDelete = async () => {
    if (!confirm("Delete this problem?")) return;
    try {
      await deleteProblem(id);
      navigate("/admin/problems");
    } catch (err) { console.error(err); }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-8">
      <div className="max-w-4xl mx-auto bg-white border border-slate-200 shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">
          {id ? "Edit Problem" : "Create New Problem"}
        </h1>

        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-2">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={form.title}
              onChange={onChange}
              placeholder="Problem Title"
              className="w-full p-3 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              required
            />
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-slate-700 mb-2">Slug (URL-friendly identifier)</label>
            <input
              type="text"
              id="slug"
              name="slug"
              value={form.slug}
              onChange={onChange}
              placeholder="problem-title-slug (optional)"
              className="w-full p-3 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          <div>
            <label htmlFor="difficulty" className="block text-sm font-medium text-slate-700 mb-2">Difficulty</label>
            <select
              id="difficulty"
              name="difficulty"
              value={form.difficulty}
              onChange={onChange}
              className="w-full p-3 border border-slate-300 rounded-lg text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">Description (Markdown)</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={onChange}
              rows={10}
              placeholder="Full problem description using Markdown"
              className="w-full p-3 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              required
            />
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-slate-700 mb-2">Tags (comma separated)</label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={form.tags}
              onChange={onChange}
              placeholder="arrays,strings,dynamic-programming"
              className="w-full p-3 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          <div>
            <label htmlFor="sampleInput" className="block text-sm font-medium text-slate-700 mb-2">Sample Input</label>
            <textarea
              id="sampleInput"
              name="sampleInput"
              value={form.sampleInput}
              onChange={onChange}
              rows={4}
              placeholder="Example input for the problem"
              className="w-full p-3 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              required
            />
          </div>

          <div>
            <label htmlFor="sampleOutput" className="block text-sm font-medium text-slate-700 mb-2">Sample Output</label>
            <textarea
              id="sampleOutput"
              name="sampleOutput"
              value={form.sampleOutput}
              onChange={onChange}
              rows={4}
              placeholder="Expected output for the sample input"
              className="w-full p-3 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              required
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            {id && (
              <button
                type="button"
                onClick={onDelete}
                className="px-5 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
                disabled={loading}
              >
                Delete
              </button>
            )}
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (id ? "Updating..." : "Creating...") : (id ? "Update Problem" : "Create Problem")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
