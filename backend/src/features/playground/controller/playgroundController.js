import { submitToJudge0, pollResult } from "../../submissions/services/judge0Service.js";

export const executePlaygroundCode = async (req, res) => {
  try {
    const { code, language, input = "" } = req.body;

    if (!code || !code.trim()) {
      return res.status(400).json({ error: "Code is required" });
    }

    if (!language) {
      return res.status(400).json({ error: "Language is required" });
    }

    
    console.log("Playground execution request:", {
      language,
      codeLength: code.length,
      inputLength: input.length
    });

    const token = await submitToJudge0(code, language, input, "");
    const result = await pollResult(token);

    return res.json({
      success: true,
      result: {
        output: result.output || "",
        stderr: result.stderr || "",
        compilationError: result.compilationError || "",
        executionTime: result.executionTime,
        memoryUsed: result.memoryUsed,
        verdict: result.verdict,
        status: result.statusText,
        isError:
          result.isCompilationError ||
          result.isRuntimeError ||
          result.isTimeoutError
      }
    });

  } catch (error) {
    console.error("Playground execution error:", error);
    res.status(500).json({
      error: error.message || "Failed to execute code",
      details: error.response?.data || null
    });
  }
};


export const getPlaygroundStats =async ( req, res ) => {
    try {
        const userId = req.user?._id;

        res.json({
            totalExecutions: 0,
             languagesUsed: [],
      recentExecutions: []
        });
    } catch ( error) {
        console.error("Get playground stats error:", error);
        res.status(500).json({ error: "Failed to fetch stats"});
    }
};

