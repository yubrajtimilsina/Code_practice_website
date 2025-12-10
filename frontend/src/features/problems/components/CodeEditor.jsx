import { useEffect, useRef, useState } from "react";
import { Play, Send, Save, Copy, RotateCcw, ArrowLeft } from "lucide-react";

import { getDraftApi, saveDraftApi } from "../api/submissionApi";
import { useNavigate } from "react-router-dom";

import Editor from "@monaco-editor/react";

// Replace the CODE_TEMPLATES constant in your CodeEditor.jsx with this:

const CODE_TEMPLATES = {
  javascript: `// Enter your JavaScript code here
function solution(input) {
  // Parse input if needed
  const lines = input.trim().split('\\n');
  
  // Your solution logic here
  
  return output;
}

// Read from input
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let input = '';
rl.on('line', (line) => {
  input += line + '\\n';
});

rl.on('close', () => {
  console.log(solution(input));
});`,

  python: `# Enter your Python code here

def solution(input_text):
    lines = input_text.strip().split('\\n')
    
    # Your solution logic here
    
    return output

# Read from stdin
if __name__ == "__main__":
    import sys
    input_text = sys.stdin.read()
    print(solution(input_text))`,

  cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    
    // Your solution logic here
    
    return 0;
}`,


  java: `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        
        // Your solution logic here
        // Example: Read a line
        // String line = br.readLine();
        
        // Example: Print output
        // System.out.println("Result");
        
        br.close();
    }
}`,

  c: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main() {
    // Your solution logic here
    
    return 0;
}`,

  csharp: `using System;
using System.Collections.Generic;
using System.Linq;

class Program {
    static void Main(string[] args) {
        // Your solution logic here
    }
}`,

  ruby: `# Enter your Ruby code here

def solution(input_text)
  lines = input_text.strip.split("\\n")
  
  # Your solution logic here
  
  output
end

input_text = STDIN.read
puts solution(input_text)`,

  go: `package main

import (
    "fmt"
    "bufio"
    "os"
    "strings"
)

func main() {
    scanner := bufio.NewScanner(os.Stdin)
    
    // Your solution logic here
    
    // Example: Read line by line
    // for scanner.Scan() {
    //     line := scanner.Text()
    //     // Process line
    // }
}`,

  typescript: `// Enter your TypeScript code here

function solution(input: string): string {
    const lines = input.trim().split('\\n');
    
    // Your solution logic here
    
    return output;
}

import * as readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let input = '';
rl.on('line', (line) => {
    input += line + '\\n';
});

rl.on('close', () => {
    console.log(solution(input));
});`,
};


export default function CodeEditor({
  problemId,
  problemTitle,
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
  const [activeTab, setActiveTab] = useState("input");
  const [autoSaveStatus, setAutoSaveStatus] = useState("");

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
    console.log("Submitting code:", { problemId, language, codeLength: code.length });
    
    const result = await onSubmit({
      code,
      language,
      problemId,
    });

    console.log("Submission result:", result);

    // Handle different verdicts
    if (result.verdict === "Accepted") {
      setVerdict({ type: "success", text: "✓ Accepted" });
      setOutput(result.output || "Solution accepted!");
    } 
    else if (result.verdict === "Compilation Error") {
      const errorMsg = result.compilationError || "Compilation failed";
      setError(errorMsg);
      setVerdict({ type: "error", text: "✗ Compilation Error" });
      
      // Show helpful hints for common compilation errors
      if (language === "java" && errorMsg.includes("class")) {
        setError(errorMsg + "\n\n💡 Hint: Make sure your class name is 'Main' for Judge0.");
      }
    } 
    else if (result.verdict === "Runtime Error") {
      setError(result.stderr || "Runtime error occurred");
      setVerdict({ type: "error", text: "✗ Runtime Error" });
    } 
    else if (result.verdict === "Wrong Answer") {
      const comparison = `Your Output:\n${result.output || "(empty)"}\n\nExpected Output:\n${result.expectedOutput || "(empty)"}`;
      setError(comparison);
      setVerdict({ type: "error", text: "✗ Wrong Answer" });
    } 
    else if (result.verdict === "Time Limit Exceeded") {
      setError("Your code took too long to execute. Try optimizing your solution.");
      setVerdict({ type: "error", text: "✗ Time Limit Exceeded" });
    }
    else {
      setError(result.verdict || "Submission failed");
      setVerdict({ type: "error", text: `✗ ${result.verdict || "Error"}` });
    }

    // Always set output if available
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

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden flex flex-col h-screen">
      {/* Header */}
      <div className="bg-slate-900 text-white px-6 py-4 border-b border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* ✅ NEW: Back to Problem Button */}
            <button
              onClick={() => navigate(`/problems/${problemId}`)}
              className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center gap-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <div>
              <h2 className="text-xl font-bold">{problemTitle}</h2>
              <p className="text-sm text-slate-400">Problem ID: {problemId}</p>
            </div>
          </div>
          {/* ✅ NEW: Auto-save status indicator */}
          {autoSaveStatus && (
            <span className="text-xs text-green-400">{autoSaveStatus}</span>
          )}
        </div>


        <div className="flex gap-2 flex-wrap">
          {Object.keys(CODE_TEMPLATES).map((lang) => (
            <button
              key={lang}
              onClick={() => handleLanguageChange(lang)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${language === lang
                ? "bg-blue-600 text-white"
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                }`}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">

        <div className="flex-1 flex flex-col border-r border-slate-200">
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


        <div className="w-96 flex flex-col border-l border-slate-200 bg-slate-50">
          {/* Tabs */}
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setActiveTab("input")}
              className={`flex-1 py-2 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === "input"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
                }`}
            >
              Input
            </button>
            <button
              onClick={() => setActiveTab("output")}
              className={`flex-1 py-2 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === "output"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
                }`}
            >
              Output
            </button>
          </div>

          <div className="flex-1 overflow-auto p-4">
            {activeTab === "input" ? (
              <div>
                <h4 className="font-semibold text-slate-700 mb-2 text-sm">Sample Input:</h4>
                <pre className="bg-white p-3 rounded border border-slate-200 text-xs font-mono text-slate-700 whitespace-pre-wrap break-words">
                  {sampleInput || "No input"}
                </pre>
              </div>
            ) : (
              <div>
                {verdict && (
                  <div
                    className={`p-3 rounded mb-4 text-sm font-medium ${verdict.type === "success"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                      }`}
                  >
                    {verdict.text}
                  </div>
                )}

                {error && (
                  <div className="mb-4">
                    <h5 className="font-semibold text-red-600 mb-2 text-sm">Error:</h5>
                    <pre className="bg-red-50 p-3 rounded border border-red-200 text-xs font-mono text-red-700 whitespace-pre-wrap break-words">
                      {error}
                    </pre>
                  </div>
                )}

                {output && !error && (
                  <div>
                    <h5 className="font-semibold text-slate-700 mb-2 text-sm">Output:</h5>
                    <pre className="bg-white p-3 rounded border border-slate-200 text-xs font-mono text-slate-700 whitespace-pre-wrap break-words">
                      {output}
                    </pre>
                  </div>
                )}

                {!output && !error && !verdict && (
                  <p className="text-slate-500 text-sm">Click "Run" to execute your code</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-slate-100 border-t border-slate-200 px-6 py-4 flex gap-2 justify-end flex-wrap">
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-slate-500 text-white rounded hover:bg-slate-600 transition-colors flex items-center gap-2 text-sm font-medium disabled:opacity-50"
          disabled={isRunning}
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>

        <button
          onClick={handleCopy}
          className="px-4 py-2 bg-slate-500 text-white rounded hover:bg-slate-600 transition-colors flex items-center gap-2 text-sm font-medium disabled:opacity-50"
          disabled={isRunning}
        >
          <Copy className="w-4 h-4" />
          Copy
        </button>

        <button
          onClick={handleRunCode}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium disabled:opacity-50"
          disabled={isRunning}
        >
          <Play className="w-4 h-4" />
          {isRunning ? "Running..." : "Run"}
        </button>

        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center gap-2 text-sm font-medium disabled:opacity-50"
          disabled={isRunning}
        >
          <Send className="w-4 h-4" />
          {isRunning ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
}



