import { evaluateSubmission, getSubmissionHistory, getUserAcceptedProblems, getProblemSubmissions } from "../use-cases/evaluateSubmission.js";

import { saveCodeDraft, getDraft, getSubmissionById, deleteSubmission, getLatestAcceptedSubmission, getUserStats } from "../use-cases/storeSubmission.js";


export const submitSolution = async (req, res) => {
    try {
        const { code, language, problemId } = req.body;
        const userId = req.user._id;

        if (!code || !code.trim()) {
            return res.status(400).json({ message: "Code cannot be empty" });
        }
        if (!language) {
            return res.status(400).json({ message: "Language is required" });
        }
        if (!problemId) {
            return res.status(400).json({ message: "Problem ID is required" });
        }

        const submission = await evaluateSubmission(userId, problemId, code, language);

        res.status(201).json({
            message: "Submission evaluated Sucessfully",
            submission,
        });

    } catch (error) {
        console.error("Submission evaluation error:",
            error.message
        );
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({ error: error.message || "Failed to submit solution" });
    }
};

export const runCode = async (req, res) => {
    try {
        const { code, language, problemId } = req.body;
        const userId = req.user._id;

        if (!code || !code.trim()) {
            return res.status(400).json({ message: "Code cannot be empty" });
        }
        if (!language) {
            return res.status(400).json({ message: "Language is required" });
        }
        if (!problemId) {
            return res.status(400).json({ message: "Problem ID is required" });
        }

        const submission = await evaluateSubmission(userId, problemId, code, language);

        res.status(201).json({
            message: "Code run sucessfully",
            submission,
        });
    } catch (error) {
        console.error("Code run error:", error.message);
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({ error: error.message || "Failed to run code" });
    }
};


export const saveDraft = async (req, res) => {
    try {
        const { code, language, problemId } = req.body;
        const userId = req.user._id;

        if (!problemId) {
            return res.status(400).json({ message: "Problem ID is required" });
        }

        const draft = await saveCodeDraft(userId, problemId, code || "", language || "JavaScript");

        res.status(200).json({
            message: "Draft saved sucessfully",
            draft,
        });
    } catch (error) {
        console.error("Save draft error:", error.message);
        res.status(500).json({
            error: error.message || "Failed to save draft",
        });
    }
};


export const getDraftCode = async (req, res) => {
    try {
        const { problemId } = req.params;
        const userId = req.user._id;

        const draft = await getDraft(userId, problemId);

        res.status(200).json({
            draft: draft || {
                code: "",
                language: "javascript",
            },
        });
    } catch (error) {
        console.error("Get draft error:", error.message);
        res.status(500).json({
            error: error.message || "Failed to get draft",
        });
    }
};

export const getSubmission = async (req, res) => {
    try {
        const { submissionId } = req.params;

        const submission = await getSubmissionById(submissionId);

    res.status(200).json(submission);
  } catch (error) {
    console.error("Get submission error:", error.message);
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      error: error.message || "Failed to get submission",
    });
  }
};


export const getHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const { problemId, limit = 10 } = req.query;

    const submissions = await getSubmissionHistory(userId, problemId, parseInt(limit));

    res.status(200).json({
      submissions,
      count: submissions.length,
    });
  } catch (error) {
    console.error("Get history error:", error.message);
    res.status(500).json({
      error: error.message || "Failed to get submission history",
    });
  }
};


export const getAccepted = async (req, res) => {
  try {
    const userId = req.user._id;

    const acceptedProblems = await getUserAcceptedProblems(userId);

    res.status(200).json({
      acceptedProblems,
      count: acceptedProblems.length,
    });
  } catch (error) {
    console.error("Get accepted problems error:", error.message);
    res.status(500).json({
      error: error.message || "Failed to get accepted problems",
    });
  }
};

export const getProblemStats = async (req, res) => {
  try {
    const { problemId } = req.params;
    const { limit = 50 } = req.query;

    const submissions = await getProblemSubmissions(problemId, parseInt(limit));

    res.status(200).json({
      submissions,
      count: submissions.length,
    });
  } catch (error) {
    console.error("Get problem stats error:", error.message);
    res.status(500).json({
      error: error.message || "Failed to get problem submissions",
    });
  }
};


export const removeSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const userId = req.user._id;

    const result = await deleteSubmission(submissionId, userId);

    res.status(200).json(result);
  } catch (error) {
    console.error("Delete submission error:", error.message);
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      error: error.message || "Failed to delete submission",
    });
  }
};


export const getUserStatistics = async (req, res) => {
  try {
    const userId = req.user._id;

    const stats = await getUserStats(userId);

    res.status(200).json(stats);
  } catch (error) {
    console.error("Get user stats error:", error.message);
    res.status(500).json({
      error: error.message || "Failed to get user statistics",
    });
  }
};

export const getLatestAccepted = async (req, res) => {
  try {
    const { problemId } = req.params;
    const userId = req.user._id;

    const submission = await getLatestAcceptedSubmission(userId, problemId);

    res.status(200).json({
      submission: submission || null,
    });
  } catch (error) {
    console.error("Get latest accepted error:", error.message);
    res.status(500).json({
      error: error.message || "Failed to get latest accepted submission",
    });
  }
};

