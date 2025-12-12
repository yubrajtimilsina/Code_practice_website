import { useEffect, useRef, useState } from "react";
import { Play, Send, Save, Copy, RotateCcw, ArrowLeft, ChevronRight, ChevronLeft, CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react";
import { getDraftApi, saveDraftApi } from "../api/submissionApi";
import { useNavigate } from "react-router-dom";
import { CODE_TEMPLATES } from "../../../utils/codeTemplates";
import Editor from "@monaco-editor/react";

export default function CodeEditor({
  problemId,
  problemTitle,
  problemDescription,
  problemDifficulty,
  problemExamples,
  problemConstraints,
  problemTopics,
  sampleInput,
  sampleOutput,
  onRun,
  onSubmit,
  loading = false,
}) {
  const editorRef = useRef(null);
  const navigate = useNavigate();

  const [code, setCode] = useState(CODE_TEMPLATES.javascript);
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [verdict, setVerdict] = useState(null);
  const [activeTab, setActiveTab] = useState("description");
  const [outputTab, setOutputTab] = useState("input");
  const [autoSaveStatus, setAutoSaveStatus] = useState("");
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);

  const [outputHeight, setOutputHeight] = useState(200);
  const [editorMinHeight, setEditorMinHeight] = useState(200);

  // FIXED: Log received data
  useEffect(() => {
    console.log("CodeEditor received:");
    console.log("Examples:", problemExamples);
    console.log("Constraints:", problemConstraints);
  }, [problemExamples, problemConstraints]);

  const initResize = (e) => {
    e.preventDefault();
    const startY = e.clientY;
    const startHeight = outputHeight;

    const doDrag = (event) => {
      const newHeight = startHeight - (event.clientY - startY);
      if (newHeight >= 100 && newHeight <= window.innerHeight * 0.7) {
        setOutputHeight(newHeight);
        setEditorMinHeight(window.innerHeight - newHeight - 120);
      }
    };

    const stopDrag = () => {
      window.removeEventListener("mousemove", doDrag);
      window.removeEventListener("mouseup", stopDrag);
    };

    window.addEventListener("mousemove", doDrag);
    window.addEventListener("mouseup", stopDrag);
  };

  useEffect(() => {
    const loadDraft = async () => {
      try {
        const response = await getDraftApi(problemId);
        if (response.data.draft) {
          setCode(response.data.draft.code);
          setLanguage(response.data.draft.language);
        } else {
          setCode(CODE_TEMPLATES[language]);
        }
      } catch (err) {
        console.error("Failed to load Draft code:", err);
        setCode(CODE_TEMPLATES[language]);
      }
    };
    loadDraft();
  }, [problemId]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (code && code.trim() !== "" && code !== CODE_TEMPLATES[language]) {
        try {
          setAutoSaveStatus("Saving...");
          await saveDraftApi(problemId, { code, language });
          setAutoSaveStatus("Saved ✓");
          setTimeout(() => setAutoSaveStatus(""), 2000);
        } catch (err) {
          console.error("Auto-save failed:", err);
          setAutoSaveStatus("Save failed ✗");
          setTimeout(() => setAutoSaveStatus(""), 3000);
        }
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [code, language, problemId]);

  const handleLanguageChange = (newLanguage) => {
    if (confirm("Changing language will reset your code. Continue?")) {
      setLanguage(newLanguage);
      setCode(CODE_TEMPLATES[newLanguage]);
    }
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setError("");
    setOutput("");
    setVerdict(null);

    try {
      const result = await onRun({
        code,
        language,
        problemId,
        input: sampleInput,
      });
      if (result.verdict === "Accepted") {
        setVerdict({ type: "success", text: "✓ Accepted" });
      } else if (result.verdict === "Compilation Error") {
        setError(result.compilationError);
      } else if (result.verdict === "Runtime Error") {
        setError(result.stderr);
      } else if (result.verdict === "Wrong Answer") {
        setError(`Expected: ${result.expectedOutput}\nGot: ${result.output}`);
      } else {
        setError(result.verdict);
      }
      setOutput(result.output || "");
    } catch (err) {
      setError(err.message || "Failed to run code");
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    setIsRunning(true);
    setError("");
    setOutput("");
    setVerdict(null);

    try {
      const result = await onSubmit({
        code,
        language,
        problemId,
      });

      if (result.verdict === "Accepted") {
        setVerdict({ type: "success", text: "✓ Accepted" });
        setOutput(result.output || "Solution accepted!");
      } else if (result.verdict === "Compilation Error") {
        const errorMsg = result.compilationError || "Compilation failed";
        setError(errorMsg);
        setVerdict({ type: "error", text: "✗ Compilation Error" });
      } else if (result.verdict === "Runtime Error") {
        setError(result.stderr || "Runtime error occurred");
        setVerdict({ type: "error", text: "✗ Runtime Error" });
      } else if (result.verdict === "Wrong Answer") {
        const comparison = `Your Output:\n${result.output || "(empty)"}\n\nExpected Output:\n${result.expectedOutput || "(empty)"}`;
        setError(comparison);
        setVerdict({ type: "error", text: "✗ Wrong Answer" });
      } else if (result.verdict === "Time Limit Exceeded") {
        setError("Your code took too long to execute. Try optimizing your solution.");
        setVerdict({ type: "error", text: "✗ Time Limit Exceeded" });
      } else {
        setError(result.verdict || "Submission failed");
        setVerdict({ type: "error", text: `✗ ${result.verdict || "Error"}` });
      }

      if (result.output) {
        setOutput(result.output);
      }
    } catch (err) {
      console.error("Submit error:", err);
      const errorMsg = err.response?.data?.error || err.message || "Failed to submit code";
      setError(errorMsg);
      setVerdict({ type: "error", text: "✗ Submission Failed" });
    } finally {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    setCode(CODE_TEMPLATES[language]);
    setOutput("");
    setError("");
    setVerdict(null);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    alert("Code copied to clipboard!");
  };

  const getVerdictIcon = () => {
    if (!verdict) return null;
    if (verdict.type === "success") return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (verdict.type === "error") return <XCircle className="w-5 h-5 text-red-500" />;
    return <Clock className="w-5 h-5 text-yellow-500" />;
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-300 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/problems/${problemId}`)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h2 className="text-lg font-bold text-gray-900">{problemTitle}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-2 py-0.5 rounded text-xs font-semibold ${problemDifficulty === "Hard" ? "bg-red-100 text-red-600" :
                problemDifficulty === "Medium" ? "bg-yellow-100 text-yellow-600" :
                  "bg-green-100 text-green-600"
                }`}>
                {problemDifficulty}
              </span>
              {problemTopics?.map((topic) => (
                <span key={topic} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </div>

        {autoSaveStatus && (
          <span className="text-xs text-green-500">{autoSaveStatus}</span>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel */}
        <div className={`bg-white border-r border-gray-300 transition-all duration-300 ${isPanelCollapsed ? "w-0" : "w-1/2"
          } overflow-hidden`}>
          <div className="h-full flex flex-col">
            {/* Tabs */}
            <div className="flex border-b border-gray-300 bg-gray-50">
              <button
                onClick={() => setActiveTab("description")}
                className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === "description"
                  ? "text-gray-900 border-b-2 border-blue-500"
                  : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                Description
              </button>
            </div>

            {/* Content - FIXED: Added proper scrolling */}
            <div className="flex-1 overflow-y-auto p-6 text-gray-900">
              {activeTab === "description" && (
                <div className="space-y-6">
                  {/* Description */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Problem Description</h3>
                    <p className="text-base leading-relaxed whitespace-pre-line">{problemDescription}</p>
                  </div>

                  {/* Examples - FIXED: Display all examples */}
                  {problemExamples && problemExamples.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-lg mb-3 text-gray-900">Examples</h3>
                      {problemExamples.map((example, idx) => (
                        <div key={idx} className="mb-4 bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <p className="text-sm font-medium text-gray-500 mb-2">Example {idx + 1}:</p>
                          <div className="space-y-2">
                            <div>
                              <span className="font-medium text-gray-900">Input: </span>
                              <pre className="inline-block bg-white px-2 py-1 rounded text-sm font-mono text-gray-800">{example.input}</pre>
                            </div>
                            <div>
                              <span className="font-medium text-gray-900">Output: </span>
                              <pre className="inline-block bg-white px-2 py-1 rounded text-sm font-mono text-gray-800">{example.output}</pre>
                            </div>
                            {example.explanation && (
                              <div>
                                <span className="font-medium text-gray-900">Explanation: </span>
                                <span className="text-gray-700">{example.explanation}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Constraints - FIXED: Display all constraints */}
                  {problemConstraints && problemConstraints.length > 0 && (
                    <div>
                      <h3 className="text-gray-900 font-semibold text-lg mb-3">Constraints</h3>
                      <ul className="space-y-2">
                        {problemConstraints.map((constraint, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-blue-600 mt-1 font-bold">•</span>
                            <span className="text-gray-900 text-sm font-mono">{constraint}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Collapse Button */}
        <button
          onClick={() => setIsPanelCollapsed(!isPanelCollapsed)}
          className="w-6 bg-gray-50 hover:bg-gray-100 border-x border-gray-300 flex items-center justify-center transition-colors group"
        >
          {isPanelCollapsed ? <ChevronRight className="w-4 h-4 text-gray-500" /> : <ChevronLeft className="w-4 h-4 text-gray-500" />}
        </button>

        {/* Right Panel - Editor */}
        <div className={`flex flex-col transition-all duration-300 ${isPanelCollapsed ? "flex-1" : "w-1/2"}`}>
          {/* Language Selector */}
          <div className="bg-gray-50 border-b border-gray-300 px-4 py-2 flex gap-2 overflow-x-auto">
            {Object.keys(CODE_TEMPLATES).map((lang) => (
              <button
                key={lang}
                onClick={() => handleLanguageChange(lang)}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors whitespace-nowrap ${language === lang ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Monaco Editor */}
          <div className="flex-1 bg-white" style={{ minHeight: editorMinHeight }}>
            <Editor
              height="100%"
              language={language}
              value={code}
              onChange={(value) => setCode(value || "")}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: "Monaco, Menlo, 'Courier New', monospace",
                lineNumbers: "on",
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          </div>

          {/* Draggable Resizer */}
          <div
            className="h-2 cursor-row-resize bg-gray-300 hover:bg-gray-400"
            onMouseDown={(e) => initResize(e)}
          ></div>

          {/* Output Panel */}
          <div
            className="bg-gray-50 flex flex-col border-t border-gray-300 overflow-hidden"
            style={{ height: outputHeight }}
          >
            {/* Output Tabs */}
            <div className="flex border-b border-gray-300 items-center">
              <button
                onClick={() => setOutputTab("input")}
                className={`px-4 py-2 text-sm font-medium transition-colors ${outputTab === "input" ? "text-gray-900 bg-white" : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                Input
              </button>
              <button
                onClick={() => setOutputTab("output")}
                className={`px-4 py-2 text-sm font-medium transition-colors ${outputTab === "output" ? "text-gray-900 bg-white" : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                Output
              </button>
              <button
                onClick={() => setOutputTab("expected")}
                className={`px-4 py-2 text-sm font-medium transition-colors ${outputTab === "expected" ? "text-gray-900 bg-white" : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                Expected
              </button>

              {verdict && (
                <div
                  className={`ml-auto mr-4 flex items-center gap-2 px-3 py-1 rounded ${verdict.type === "success" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                    }`}
                >
                  {getVerdictIcon()}
                  <span className="text-sm font-medium">{verdict.text}</span>
                </div>
              )}
            </div>

            {/* Output Content */}
            <div className="flex-1 overflow-y-auto p-4 text-gray-900">
              {outputTab === "input" && <pre className="text-sm font-mono whitespace-pre-wrap">{sampleInput || "No input"}</pre>}
              {outputTab === "output" && (
                <div>
                  {error && <pre className="text-red-600 text-sm font-mono bg-red-100 p-3 rounded">{error}</pre>}
                  {output && !error && <pre className="text-gray-900 text-sm font-mono bg-gray-100 p-3 rounded">{output}</pre>}
                  {!output && !error && !isRunning && (
                    <div className="text-gray-500 text-sm italic flex items-center gap-2">
                      <Play className="w-4 h-4" /> Click "Run" to execute your code
                    </div>
                  )}
                  {isRunning && (
                    <div className="text-blue-600 text-sm flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div> Running your code...
                    </div>
                  )}
                </div>
              )}
              {outputTab === "expected" && <pre className="text-sm font-mono whitespace-pre-wrap">{sampleOutput || "No expected output"}</pre>}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-gray-50 border-t border-gray-300 px-4 py-3 flex justify-between items-center">
            <div className="flex gap-2">
              <button onClick={handleReset} disabled={isRunning} className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center gap-2 text-sm disabled:opacity-50">
                <RotateCcw className="w-4 h-4" /> Reset
              </button>
              <button onClick={handleCopy} disabled={isRunning} className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center gap-2 text-sm disabled:opacity-50">
                <Copy className="w-4 h-4" /> Copy
              </button>
            </div>
            <div className="flex gap-2">
              <button onClick={handleRunCode} disabled={isRunning} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center gap-2 font-medium disabled:opacity-50">
                {isRunning ? <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> Running...</> : <><Play className="w-4 h-4" /> Run</>}
              </button>
              <button onClick={handleSubmit} disabled={isRunning} className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center gap-2 font-medium disabled:opacity-50">
                {isRunning ? <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> Submitting...</> : <><Send className="w-4 h-4" /> Submit</>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}