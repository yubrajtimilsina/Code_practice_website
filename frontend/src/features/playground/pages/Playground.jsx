import { useState, useRef } from "react";
import { Play, Download, Upload, Trash2, Copy, Info } from "lucide-react";
import Editor from "@monaco-editor/react";
import { executeCode } from "../api/playgroundApi";
import { CODE_TEMPLATES } from "../../../utils/codeTemplates";
import AlertModal from "../../../components/AlertModal";
import { useAlert } from "../../../hooks/useAlert";

export default function Playground() {
  const editorRef = useRef(null);
  const { alert, showSuccess, showError, showConfirm, hideAlert } = useAlert();

  // Code execution state
  const [code, setCode] = useState(CODE_TEMPLATES.javascript);
  const [language, setLanguage] = useState("javascript");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [executionTime, setExecutionTime] = useState("");
  const [memoryUsed, setMemoryUsed] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLanguageChange = (newLang) => {
    if (code !== CODE_TEMPLATES[language]) {
      showConfirm(
        "Switching languages will reset your code. Continue?",
        () => {
          setLanguage(newLang);
          setCode(CODE_TEMPLATES[newLang]);
          setOutput("");
        }
      );
    } else {
      setLanguage(newLang);
      setCode(CODE_TEMPLATES[newLang]);
      setOutput("");
    }
  };

  const handleRunCode = async () => {
    try {
      setOutput("");
      setError(null);
      setLoading(true);

      const response = await executeCode({
        code,
        language,
        input: input.trim()
      });

      const result = response.data.result;

      if (result.isError || result.stderr || result.compilationError) {
        setError(result.compilationError || result.stderr || "Execution error");
      } else {
        setOutput(result.output || "(No output)");
        setExecutionTime(result.executionTime);
        setMemoryUsed(result.memoryUsed);
      }
    } catch (err) {
      setError(err.message || "Failed to execute code");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    showConfirm(
      "Reset code to template?",
      () => {
        setCode(CODE_TEMPLATES[language]);
        setInput("");
        setOutput("");
      }
    );
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    showSuccess("Code copied to clipboard!");
  };

  const handleDownload = () => {
    const extensions = {
      javascript: "js",
      python: "py",
      java: "java",
      cpp: "cpp",
      c: "c",
      typescript: "ts",
      go: "go",
      ruby: "rb",
      csharp: "cs"
    };

    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `code.${extensions[language] || "txt"}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <AlertModal {...alert} onClose={hideAlert} />

      <div className="min-h-screen bg-slate-100 p-6">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold text-slate-900 mb-2">
                  Code Playground
                </h1>
                <p className="text-slate-600">
                  Write and execute code in multiple languages instantly
                </p>
              </div>

              {/* Language Selector */}
              <div className="flex items-center gap-3">
                <select
                  value={language}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  {Object.keys(CODE_TEMPLATES).map((lang) => (
                    <option key={lang} value={lang}>
                      {lang.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Info Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <strong>Playground Mode:</strong> Test code snippets, experiment with algorithms,
                or practice syntax without submitting to problems. Your code runs in a sandboxed environment.
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Left Column - Code Editor */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="bg-slate-900 text-white px-6 py-3 flex items-center justify-between sticky top-0 z-10">
                <h3 className="font-semibold">Code Editor</h3>

                <div className="flex items-center gap-2">
                  {/* Copy */}
                  <button
                    onClick={handleCopy}
                    className="p-2 hover:bg-slate-700 rounded"
                    title="Copy code"
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                  {/* Download */}
                  <button
                    onClick={handleDownload}
                    className="p-2 hover:bg-slate-700 rounded"
                    title="Download code"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  {/* Reset */}
                  <button
                    onClick={handleReset}
                    disabled={loading}
                    className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-sm disabled:opacity-50"
                  >
                    Reset
                  </button>

                  {/* Run */}
                  <button
                    onClick={handleRunCode}
                    disabled={loading}
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 rounded text-sm font-semibold flex items-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-b-2 border-white rounded-full" />
                        Running
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        Run
                      </>
                    )}
                  </button>
                </div>
              </div>


              <div className="h-[500px]">
                <Editor
                  height="100%"
                  language={language}
                  value={code}
                  onChange={(value) => setCode(value || "")}
                  theme="vs-light"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    fontFamily: "Monaco, Menlo, 'Courier New', monospace",
                    lineNumbers: "on",
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                  }}
                  onMount={(editor) => {
                    editorRef.current = editor;
                  }}
                />
              </div>
            </div>

            <div className="space-y-6">

              {/* Input Section */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="bg-slate-100 px-6 py-3 border-b border-slate-200">
                  <h3 className="font-semibold text-slate-900">Input (stdin)</h3>
                </div>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter input for your program (optional)..."
                  rows={8}
                  className="w-full p-4 font-mono text-sm focus:outline-none resize-none"
                />
              </div>

              {/* Output Section */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="bg-slate-100 px-6 py-3 border-b border-slate-200 flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900">Output</h3>
                  {executionTime && (
                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-slate-600">
                        Time: <strong>{executionTime}</strong>
                      </span>
                      <span className="text-slate-600">
                        Memory: <strong>{memoryUsed}</strong>
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-4 min-h-[200px]">
                  {loading ? (
                    <div className="flex items-center gap-3 text-blue-600">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600" />
                      <span>Executing your code...</span>
                    </div>
                  ) : error ? (
                    <pre className="text-red-600 text-sm font-mono whitespace-pre-wrap bg-red-50 p-3 rounded-lg border border-red-200">
                      {error}
                    </pre>
                  ) : output ? (
                    <pre className="text-slate-800 text-sm font-mono whitespace-pre-wrap bg-slate-50 p-3 rounded-lg border border-slate-200">
                      {output}
                    </pre>
                  ) : (
                    <p className="text-slate-400 italic">
                      Click "Run Code" to see output here
                    </p>
                  )}
                </div>
              </div>

              {/* Tips Card */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-2xl p-6">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Info className="w-5 h-5 text-purple-600" />
                  Quick Tips
                </h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">•</span>
                    <span>Use stdin/stdout for input/output</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">•</span>
                    <span>Time limit: 5 seconds per execution</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">•</span>
                    <span>Memory limit: 256 MB</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">•</span>
                    <span>Save your work locally - playground doesn't persist code</span>
                  </li>
                </ul>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}