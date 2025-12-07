import { evaluateSubmission, getSubmissionHistory, getUserAcceptedProblems, getProblemSubmissions } from "../use-cases/evaluateSubmission.js";
import { saveCodeDraft, getDraft, getSubmissionById, deleteSubmission, getLatestAcceptedSubmission, getUserStats } from "../use-cases/storeSubmission.js";

export const submitSolution = async (req, res) => {
    try {
        const { code, language, problemId } = req.body;
        const userId = req.user._id;

        console.log("Submit solution request:", { userId, problemId, language, codeLength: code?.length });

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
            message: "Submission evaluated successfully",
            submission,
        });

    } catch (error) {
        console.error("Submission evaluation error:", error);
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({ 
            error: error.message || "Failed to submit solution",
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

export const runCode = async (req, res) => {
    try {
        const { code, language, problemId } = req.body;
        const userId = req.user._id;

        console.log("Run code request:", { userId, problemId, language, codeLength: code?.length });

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
            message: "Code run successfully",
            submission,
        });
    } catch (error) {
        console.error("Code run error:", error);
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({ 
            error: error.message || "Failed to run code",
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

export const saveDraft = async (req, res) => {
    try {
        const { code, language, problemId: bodyProblemId } = req.body;
        const { problemId: paramProblemId } = req.params;
        const userId = req.user._id;

        // Use problemId from params, fallback to body
        const problemId = paramProblemId || bodyProblemId;

        console.log("Save draft request:", { userId, problemId, language, codeLength: code?.length });

        if (!problemId) {
            return res.status(400).json({ message: "Problem ID is required" });
        }

        const draft = await saveCodeDraft(userId, problemId, code || "", language || "javascript");

        res.status(200).json({
            message: "Draft saved successfully",
            draft,
        });
    } catch (error) {
        console.error("Save draft error:", error);
        res.status(500).json({
            error: error.message || "Failed to save draft",
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

export const getDraftCode = async (req, res) => {
    try {
        const { problemId } = req.params;
        const userId = req.user._id;

        console.log("Get draft request:", { userId, problemId });

        const draft = await getDraft(userId, problemId);

        res.status(200).json({
            draft: draft || {
                code: "",
                language: "javascript",
            },
        });
    } catch (error) {
        console.error("Get draft error:", error);
        res.status(500).json({
            error: error.message || "Failed to get draft",
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

export const getSubmission = async (req, res) => {
    try {
        const { submissionId } = req.params;

        console.log("Get submission request:", { submissionId });

        const submission = await getSubmissionById(submissionId);

        res.status(200).json(submission);
    } catch (error) {
        console.error("Get submission error:", error);
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            error: error.message || "Failed to get submission",
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

export const getHistory = async (req, res) => {
    try {
        const userId = req.user._id;
        const { problemId, limit = 10 } = req.query;

        console.log("Get history request:", { userId, problemId, limit });

        const submissions = await getSubmissionHistory(userId, problemId, parseInt(limit));

        res.status(200).json({
            submissions,
            count: submissions.length,
        });
    } catch (error) {
        console.error("Get history error:", error);
        res.status(500).json({
            error: error.message || "Failed to get submission history",
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

export const getAccepted = async (req, res) => {
    try {
        const userId = req.user._id;

        console.log("Get accepted problems request:", { userId });

        const acceptedProblems = await getUserAcceptedProblems(userId);

        res.status(200).json({
            acceptedProblems,
            count: acceptedProblems.length,
        });
    } catch (error) {
        console.error("Get accepted problems error:", error);
        res.status(500).json({
            error: error.message || "Failed to get accepted problems",
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

export const getProblemStats = async (req, res) => {
    try {
        const { problemId } = req.params;
        const { limit = 50 } = req.query;

        console.log("Get problem stats request:", { problemId, limit });

        const submissions = await getProblemSubmissions(problemId, parseInt(limit));

        res.status(200).json({
            submissions,
            count: submissions.length,
        });
    } catch (error) {
        console.error("Get problem stats error:", error);
        res.status(500).json({
            error: error.message || "Failed to get problem submissions",
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

export const removeSubmission = async (req, res) => {
    try {
        const { submissionId } = req.params;
        const userId = req.user._id;

        console.log("Delete submission request:", { submissionId, userId });

        const result = await deleteSubmission(submissionId, userId);

        res.status(200).json(result);
    } catch (error) {
        console.error("Delete submission error:", error);
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            error: error.message || "Failed to delete submission",
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

export const getUserStatistics = async (req, res) => {
    try {
        const userId = req.user._id;

        console.log("Get user stats request:", { userId });

        const stats = await getUserStats(userId);

        res.status(200).json(stats);
    } catch (error) {
        console.error("Get user stats error:", error);
        res.status(500).json({
            error: error.message || "Failed to get user statistics",
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

export const getLatestAccepted = async (req, res) => {
    try {
        const { problemId } = req.params;
        const userId = req.user._id;

        console.log("Get latest accepted request:", { problemId, userId });

        const submission = await getLatestAcceptedSubmission(userId, problemId);

        res.status(200).json({
            submission: submission || null,
        });
    } catch (error) {
        console.error("Get latest accepted error:", error);
        res.status(500).json({
            error: error.message || "Failed to get latest accepted submission",
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};