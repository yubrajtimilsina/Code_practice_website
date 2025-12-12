import mongoose from "mongoose";
import Submission from "../models/submissionModel.js";
import User from "../../auth/models/UserModels.js";
import Problem from "../../problems/models/ProblemModel.js";

export const saveCodeDraft = async (userId, problemId, code, language) => {
  try {
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
      // FIXED: wrong method .createSearchIndex() -> .create()
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
  } catch (error) {
    console.error("Saving draft code error:", error.message);
    throw error;
  }
};

export const getDraft = async (userId, problemId) => {
  try {
    const draft = await Submission.findOne({
      userId,
      problemId,
      verdict: "Draft",
    }).lean();

    return draft || null;
  } catch (error) {
    console.error("Fetching draft code error:", error.message);
    throw error;
  }
};

export const getSubmissionById = async (submissionId) => {
  try {
    const submission = await Submission.findById(submissionId)
      .populate("userId", "name email")
      .populate("problemId", "title slug") // FIXED: "of" removed
      .lean();

    if (!submission) {
      const error = new Error("Submission not found");
      error.statusCode = 404;
      throw error;
    }

    return submission;
  } catch (error) {
    console.error("Fetching submission by ID error:", error.message);
    throw error;
  }
};

export const deleteSubmission = async (submissionId, userId) => {
  try {
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
  } catch (error) {
    console.error("Deleting submission error:", error.message);
    throw error;
  }
};

export const getLatestAcceptedSubmission = async (userId, problemId) => {
  try {
    const submission = await Submission.findOne({
      userId,
      problemId,
      isAccepted: true,
    })
      .sort({ createdAt: -1 })
      .lean();

    return submission || null; // FIXED typo (nulll)
  } catch (error) {
    console.error("Fetching latest accepted submission error:", error.message);
    throw error;
  }
};

export const getUserStats = async (userId) => {
  try {
    // FIXED: no require() — use mongoose import
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
  } catch (error) {
    console.error("Get user stats error:", error.message);
    throw error;
  }
};


export const updateUserStats = async (userId, problemId, isAccepted) => {
  try {
    const user = await User.findById(userId);
    const problem = await Problem.findById(problemId);
    
    if (!user || !problem) {
      console.error("User or problem not found for stats update");
      return;
    }
    
    // Update submission count
    user.totalSubmissionsCount = (user.totalSubmissionsCount || 0) + 1;
    
    if (isAccepted) {
      user.acceptedSubmissionsCount = (user.acceptedSubmissionsCount || 0) + 1;
      
      // Check if this is first accepted solution for this problem
      const previousAccepted = await Submission.countDocuments({
        userId,
        problemId,
        isAccepted: true,
        createdAt: { $lt: new Date() }
      });
      
      if (previousAccepted === 1) { // Including current submission
        user.solvedProblemsCount = (user.solvedProblemsCount || 0) + 1;
        
        // Update difficulty-specific counts
        if (problem.difficulty === 'Easy') {
          user.easyProblemsSolved = (user.easyProblemsSolved || 0) + 1;
        } else if (problem.difficulty === 'Medium') {
          user.mediumProblemsSolved = (user.mediumProblemsSolved || 0) + 1;
        } else if (problem.difficulty === 'Hard') {
          user.hardProblemsSolved = (user.hardProblemsSolved || 0) + 1;
        }
        
        // Update rank points
        user.rankPoints = user.calculateRankPoints();
      }
    }
    
    // Update streak
    user.updateStreak();
    user.lastActiveDate = new Date();
    
    await user.save();
    
    console.log(`✅ Updated user stats for ${user.name}:`, {
      solved: user.solvedProblemsCount,
      total: user.totalSubmissionsCount,
      accepted: user.acceptedSubmissionsCount,
      rankPoints: user.rankPoints,
      streak: user.currentStreak
    });
    
  } catch (error) {
    console.error("Error updating user stats:", error);
  }
};