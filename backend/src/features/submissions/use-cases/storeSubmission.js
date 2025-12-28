import mongoose from "mongoose";
import Submission from "../models/submissionModel.js";
import User from "../../auth/models/UserModels.js";
import Problem from "../../problems/models/ProblemModel.js";

export const saveCodeDraft = async (userId, problemId, code, language) => {
  let draft = await Submission.findOne({
    userId,
    problemId,
    verdict: "Draft",
  });

  if (draft) {
    draft.code = code;
    draft.language = language;
    draft.updatedAt = Date.now();
    await draft.save();
    return draft.toObject();
  } else {
    const newDraft = await Submission.create({
      userId,
      problemId,
      code,
      language,
      verdict: "Draft",
      status: 0,
    });
    return newDraft.toObject();
  }
};

export const getDraft = async (userId, problemId) => {
  const draft = await Submission.findOne({
    userId,
    problemId,
    verdict: "Draft",
  }).lean();

  return draft || null;
};

export const getSubmissionById = async (submissionId) => {
  const submission = await Submission.findById(submissionId)
    .populate("userId", "name email")
    .populate("problemId", "title slug")
    .lean();

  if (!submission) {
    const error = new Error("Submission not found");
    error.statusCode = 404;
    throw error;
  }

  return submission;
};

export const deleteSubmission = async (submissionId, userId) => {
  const submission = await Submission.findById(submissionId);

  if (!submission) {
    const error = new Error("Submission not found");
    error.statusCode = 404;
    throw error;
  }

  if (submission.userId.toString() !== userId.toString()) {
    const error = new Error("Unauthorized to delete this submission");
    error.statusCode = 403;
    throw error;
  }

  await Submission.findByIdAndDelete(submissionId);
  return { message: "Submission deleted successfully" };
};

export const getLatestAcceptedSubmission = async (userId, problemId) => {
  const submission = await Submission.findOne({
    userId,
    problemId,
    isAccepted: true,
  })
    .sort({ createdAt: -1 })
    .lean();

  return submission || null;
};

export const getUserStats = async (userId) => {
  const stats = await Submission.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $group: {
        _id: null,
        totalSubmissions: { $sum: 1 },
        acceptedSubmissions: {
          $sum: { $cond: ["$isAccepted", 1, 0] },
        },
        distinctProblems: { $addToSet: "$problemId" },
        verdictCounts: { $push: "$verdict" },
      },
    },
    {
      $project: {
        _id: 0,
        totalSubmissions: 1,
        acceptedSubmissions: 1,
        distinctProblems: { $size: "$distinctProblems" },
        verdictCounts: 1,
      },
    },
  ]);

  return (
    stats[0] || {
      totalSubmissions: 0,
      acceptedSubmissions: 0,
      distinctProblems: 0,
      verdictCounts: [],
    }
  );
};

