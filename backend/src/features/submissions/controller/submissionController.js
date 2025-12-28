import { evaluateSubmission, getSubmissionHistory, getUserAcceptedProblems, getProblemSubmissions } from "../use-cases/evaluateSubmission.js";
import { saveCodeDraft, getDraft, getSubmissionById, deleteSubmission, getLatestAcceptedSubmission, getUserStats } from "../use-cases/storeSubmission.js";
import { errorHandler } from "../../../middlewares/errorMiddleware.js";

export const submitSolution = async (req, res) => {
    const { code, language, problemId } = req.body;
    const userId = req.user._id;

    const submission = await evaluateSubmission(userId, problemId, code, language);

    res.status(201).json({
        message: "Submission evaluated successfully",
        submission,
    });
};

export const runCode = async (req, res) => {
    const { code, language, problemId } = req.body;
    const userId = req.user._id;

    const submission = await evaluateSubmission(userId, problemId, code, language);

    res.status(201).json({
        message: "Code run successfully",
        submission,
    });
};

export const saveDraft = async (req, res) => {
    const { code, language, problemId: bodyProblemId } = req.body;
    const { problemId: paramProblemId } = req.params;
    const userId = req.user._id;

    const problemId = paramProblemId || bodyProblemId;

    if (!problemId) {
        return res.status(400).json({ message: "Problem ID is required" });
    }

    const draft = await saveCodeDraft(userId, problemId, code || "", language || "javascript");

    res.status(200).json({
        message: "Draft saved successfully",
        draft,
    });
};

export const getDraftCode = async (req, res) => {
    const { problemId } = req.params;
    const userId = req.user._id;

    const draft = await getDraft(userId, problemId);

    res.status(200).json({
        draft: draft || {
            code: "",
            language: "javascript",
        },
    });
};

export const getSubmission = async (req, res) => {
    const { submissionId } = req.params;

    const submission = await getSubmissionById(submissionId);

    res.status(200).json(submission);
};

export const getHistory = async (req, res) => {
    const userId = req.user._id;
    const { 
        problemId, 
        page = 1, 
        limit = 20,
        verdict 
    } = req.query;

    const result = await getSubmissionHistory(userId, {
        problemId,
        page: parseInt(page),
        limit: parseInt(limit),
        verdict
    });

    res.status(200).json({
        submissions: result.submissions,
        total: result.pagination.total,
        pagination: result.pagination,
        count: result.submissions.length,
    });
};

export const getAccepted = async (req, res) => {
    const userId = req.user._id;

    const acceptedProblems = await getUserAcceptedProblems(userId);

    res.status(200).json({
        acceptedProblems,
        count: acceptedProblems.length,
    });
};

export const getProblemStats = async (req, res) => {
    const { problemId } = req.params;
    const { limit = 50 } = req.query;

    const submissions = await getProblemSubmissions(problemId, parseInt(limit));

    res.status(200).json({
        submissions,
        count: submissions.length,
    });
};

export const removeSubmission = async (req, res) => {
    const { submissionId } = req.params;
    const userId = req.user._id;

    const result = await deleteSubmission(submissionId, userId);

    res.status(200).json(result);
};

export const getUserStatistics = async (req, res) => {
    const userId = req.user._id;

    const stats = await getUserStats(userId);

    res.status(200).json(stats);
};

export const getLatestAccepted = async (req, res) => {
    const { problemId } = req.params;
    const userId = req.user._id;

    const submission = await getLatestAcceptedSubmission(userId, problemId);

    res.status(200).json({
        submission: submission || null,
    });
};