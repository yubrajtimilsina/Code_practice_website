import { useEffect, useState } from "react";
import { createProblem, getProblem, updateProblem, deleteProblem } from "../api/problemApi";
import { useNavigate, useParams } from "react-router-dom";
import { AlertCircle, Save, Trash2, Plus, X } from "lucide-react";

export default function AdminProblemForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    difficulty: "Easy",
    tags: "",
    sampleInput: "",
    sampleOutput: "",
    timeLimitSec: 1,
    memoryLimitMB: 256,
    constraints: "",
    hints: ""
  });

  const [examples, setExamples] = useState([
    { input: "", output: "", explanation: "" }
  ]);

  const [testCases, setTestCases] = useState([
    { input: "", expectedOutput: "", isHidden: false }
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      setLoading(true);
      getProblem(id)
        .then(res => {
          const p = res.data;
          setForm({
            title: p.title || "",
            slug: p.slug || "",
            description: p.description || "",
            difficulty: p.difficulty || "Easy",
            tags: (p.tags || []).join(","),
            sampleInput: p.sampleInput || "",
            sampleOutput: p.sampleOutput || "",
            timeLimitSec: p.timeLimitSec || 1,
            memoryLimitMB: p.memoryLimitMB || 256,
            constraints: (p.constraints || []).join("\n"),
            hints: (p.hints || []).join("\n")
          });
          
          if (p.examples && p.examples.length > 0) {
            setExamples(p.examples);
          }
          
          if (p.testCases && p.testCases.length > 0) {
            setTestCases(p.testCases);
          }
        })
        .catch(err => {
          console.error(err);
          setError("Failed to load problem details");
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === "timeLimitSec" || name === "memoryLimitMB" ? parseInt(value) || 0 : value
    }));
  };

  const handleExampleChange = (index, field, value) => {
    const updated = [...examples];
    updated[index][field] = value;
    setExamples(updated);
  };

  const addExample = () => {
    setExamples([...examples, { input: "", output: "", explanation: "" }]);
  };

  const removeExample = (index) => {
    if (examples.length > 1) {
      setExamples(examples.filter((_, i) => i !== index));
    }
  };

  const handleTestCaseChange = (index, field, value) => {
    const updated = [...testCases];
    if (field === "isHidden") {
      updated[index].isHidden = value;
    } else {
      updated[index][field] = value;
    }
    setTestCases(updated);
  };

  const addTestCase = () => {
    setTestCases([...testCases, { input: "", expectedOutput: "", isHidden: false }]);
  };

  const removeTestCase = (index) => {
    if (testCases.length > 1) {
      setTestCases(testCases.filter((_, i) => i !== index));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!form.title.trim()) {
        throw new Error("Title is required");
      }
      if (!form.description.trim()) {
        throw new Error("Description is required");
      }
      if (!form.sampleInput.trim() || !form.sampleOutput.trim()) {
        throw new Error("Sample input and output are required");
      }

      const payload = {
        ...form,
        tags: form.tags
          .split(",")
          .map(t => t.trim())
          .filter(Boolean),
        constraints: form.constraints
          .split("\n")
          .map(c => c.trim())
          .filter(Boolean),
        hints: form.hints
          .split("\n")
          .map(h => h.trim())
          .filter(Boolean),
        examples: examples.filter(ex => ex.input.trim() && ex.output.trim()),
        testCases: testCases.filter(tc => tc.input.trim() && tc.expectedOutput.trim()),
      };

      console.log("Submitting problem payload:", payload);

      if (id) {
        await updateProblem(id, payload);
      } else {
        await createProblem(payload);
      }
      navigate("/admin/problems");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to save problem");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    if (!confirm("Delete this problem? This action cannot be undone.")) return;
    try {
      setLoading(true);
      await deleteProblem(id);
      navigate("/admin/problems");
    } catch (err) {
      console.error(err);
      setError("Failed to delete problem");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-8">
      <div className="max-w-6xl mx-auto bg-white border border-slate-200 shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">
          {id ? "Edit Problem" : "Create New Problem"}
        </h1>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="border-b pb-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={onChange}
                  placeholder="e.g., Two Sum Problem"
                  className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Difficulty <span className="text-red-500">*</span>
                </label>
                <select
                  name="difficulty"
                  value={form.difficulty}
                  onChange={onChange}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={onChange}
                rows={10}
                placeholder="Full problem description"
                className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={form.tags}
                  onChange={onChange}
                  placeholder="arrays,strings,dynamic-programming"
                  className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Examples Section */}
          <div className="border-b pb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900">Examples</h2>
              <button
                type="button"
                onClick={addExample}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Example
              </button>
            </div>

            <div className="space-y-4">
              {examples.map((example, idx) => (
                <div key={idx} className="border border-slate-300 rounded-lg p-4 bg-slate-50">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-slate-700">Example {idx + 1}</span>
                    {examples.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeExample(idx)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-slate-600 mb-1 block">Input</label>
                      <input
                        type="text"
                        value={example.input}
                        onChange={(e) => handleExampleChange(idx, "input", e.target.value)}
                        placeholder="nums1 = [1,3], nums2 = [2]"
                        className="w-full p-2 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-600 mb-1 block">Output</label>
                      <input
                        type="text"
                        value={example.output}
                        onChange={(e) => handleExampleChange(idx, "output", e.target.value)}
                        placeholder="2.00000"
                        className="w-full p-2 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-600 mb-1 block">Explanation (optional)</label>
                      <textarea
                        value={example.explanation}
                        onChange={(e) => handleExampleChange(idx, "explanation", e.target.value)}
                        placeholder="merged array = [1,2,3] and median is 2."
                        rows={2}
                        className="w-full p-2 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Constraints Section */}
          <div className="border-b pb-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Constraints & Limits</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Constraints (one per line)
              </label>
              <textarea
                name="constraints"
                value={form.constraints}
                onChange={onChange}
                rows={5}
                placeholder="nums1.length == m&#10;nums2.length == n&#10;0 <= m <= 1000"
                className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Time Limit (seconds) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="timeLimitSec"
                  value={form.timeLimitSec}
                  onChange={onChange}
                  min="1"
                  max="30"
                  className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Memory Limit (MB) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="memoryLimitMB"
                  value={form.memoryLimitMB}
                  onChange={onChange}
                  min="64"
                  max="1024"
                  className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Sample I/O */}
          <div className="border-b pb-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Sample Input & Output</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Sample Input <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="sampleInput"
                  value={form.sampleInput}
                  onChange={onChange}
                  rows={4}
                  placeholder="Example input for the problem"
                  className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Sample Output <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="sampleOutput"
                  value={form.sampleOutput}
                  onChange={onChange}
                  rows={4}
                  placeholder="Expected output for the sample input"
                  className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Test Cases */}
          <div className="border-b pb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900">Test Cases</h2>
              <button
                type="button"
                onClick={addTestCase}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Test Case
              </button>
            </div>

            <div className="space-y-4">
              {testCases.map((tc, idx) => (
                <div key={idx} className="border border-slate-300 rounded-lg p-4 bg-slate-50">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-slate-700">Test Case {idx + 1}</span>
                    {testCases.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTestCase(idx)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div>
                      <label className="text-xs font-medium text-slate-600 mb-1 block">Input</label>
                      <textarea
                        value={tc.input}
                        onChange={(e) => handleTestCaseChange(idx, "input", e.target.value)}
                        rows={3}
                        placeholder="Test input"
                        className="w-full p-2 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-600 mb-1 block">Expected Output</label>
                      <textarea
                        value={tc.expectedOutput}
                        onChange={(e) => handleTestCaseChange(idx, "expectedOutput", e.target.value)}
                        rows={3}
                        placeholder="Expected output"
                        className="w-full p-2 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={tc.isHidden}
                      onChange={(e) => handleTestCaseChange(idx, "isHidden", e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span className="text-slate-700">Hide this test case (only for evaluation)</span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Hints */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-4">Hints (Optional)</h2>
            <textarea
              name="hints"
              value={form.hints}
              onChange={onChange}
              rows={4}
              placeholder="Add hints (one per line) to help learners solve the problem"
              className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            {id && (
              <button
                type="button"
                onClick={onDelete}
                disabled={loading}
                className="px-5 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            )}
            <button
              type="button"
              onClick={() => navigate("/admin/problems")}
              disabled={loading}
              className="px-5 py-2 bg-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-400 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {loading ? (id ? "Updating..." : "Creating...") : (id ? "Update Problem" : "Create Problem")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}