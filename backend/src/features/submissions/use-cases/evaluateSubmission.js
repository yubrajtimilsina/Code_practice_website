import { submitToJudge0, pollResult } from "../services/judge0Service.js";
import Submission from "../models/submissionModel.js";
import Problem from "../../problems/models/ProblemModel.js";
import User from "../../auth/models/UserModels.js";
import { updateUserStatistics, updateProblemStatistics } from "../services/submissionService.js";
import { processDailyChallengeCompletion } from "../../dailyChallenge/services/dailyChallengeService.js";

export const evaluateSubmission = async (userId, problemId, code, language) => {
    const problem = await Problem.findById(problemId);
    if (!problem) {
        const error = new Error("Problem not found");
        error.statusCode = 404;
        throw error;
    }

    const user = await User.findById(userId);
    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    const isAdmin = user.role === 'admin' || user.role === 'super-admin';

    if (isAdmin) {
        const judge0Token = await submitToJudge0(
            code,
            language,
            problem.sampleInput || "",
            problem.sampleOutput || ""
        );
        const result = await pollResult(judge0Token);
        return {
            ...result,
            verdict: `Test - ${result.verdict}`,
            isAccepted: false,
        };
    }

    let submission = await Submission.create({
        userId,
        problemId,
        code,
        language,
        verdict: "Pending",
        status: 0,
    });

    try {
        const judge0Token = await submitToJudge0(
            code,
            language,
            problem.sampleInput || "",
            problem.sampleOutput || ""
        );

        submission.judge0Token = judge0Token;
        await submission.save();

        const result = await pollResult(judge0Token);

        let finalVerdict = result.verdict;

        if (result.verdict === "Accepted" && !result.isAccepted) {
            finalVerdict = "Wrong Answer";
        }

        submission.verdict = finalVerdict;
        submission.status = result.status;
        submission.output = result.output || "";
        submission.stderr = result.stderr || "";
        submission.compilationError = result.compilationError || "";
        submission.executionTime = result.executionTime;
        submission.memoryUsed = result.memoryUsed;
        submission.isAccepted = result.isAccepted;
        submission.expectedOutput = result.expectedOutput || "";

        await submission.save();

        await updateUserStatistics(userId, problemId, result.isAccepted, submission._id);
        await updateProblemStatistics(problemId, result.isAccepted);

        if (result.isAccepted) {
            await processDailyChallengeCompletion(
                userId,
                submission._id,
                problemId,
                result.executionTime,
                language
            );
        }

        return submission.toObject();
    } catch (judgeError) {
        submission.verdict = "System Error";
        submission.stderr = judgeError.message;
        submission.status = 13;
        await submission.save();

        throw judgeError;
    }
};

export const getSubmissionHistory = async (userId, filters = {}) => {
    const {
        problemId = null,
        page = 1,
        limit = 20,
        verdict = null
    } = filters;

    const query = { userId };
    if (problemId) {
        query.problemId = problemId;
    }
    if (verdict && verdict !== "all") {
        query.verdict = verdict;
    }
    const skip = (page - 1) * limit;

    const total = await Submission.countDocuments(query);

    const submissions = await Submission.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('problemId', 'title slug difficulty')
        .lean();

    return {
        submissions,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            totalPages: Math.ceil(total / limit),
            hasNextPage: page * limit < total,
            hasPrevPage: page > 1
        }
    };
};

export const getUserAcceptedProblems = async (userId) => {
    const acceptedSubmissions = await Submission.find({
        userId,
        isAccepted: true,
    })
        .distinct("problemId")
        .lean();

    return acceptedSubmissions;
};

export const getProblemSubmissions = async (problemId, limit = 50) => {
    const submissions = await Submission.find({
        problemId
    })
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate('userId', 'name email')
        .lean();

    return submissions;
};