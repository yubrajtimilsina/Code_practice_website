import { submitToJudge0, pollResult } from "../services/judge0Service";

import Submission from "../models/Submission.js";
import Problem from "../../problems/models/ProblemModel.js";
import User from "../../auth/models/UserModels.js";


export const evaluateSubmission = async (userId, problemId, code, language) => {
    try {
        if (!userId || !problemId || !code || !language) {
            const error = new Error ("Missing required parameters for evaluating submission.");
            error.statusCode = 400;
            throw error;
        }

     const problem = await Problem.findById(problemId);
    if (!problem) {
      const error = new Error("Problem not found");
      error.statusCode = 404;
      throw error;
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

        submission.verdict = result.verdict;
        submission.status = result.status;
        submission.output = result.output || "";
        submission.stderr = result.stderr || "";
        submission.compilationError = result.compilationError || "";
        submission.executionTime = result.executionTime;
        submission.memoryUsed = result.memoryUsed;
        submission.isAccepted = result.isAccepted;
        submission.expectedOutput = result.expectedOutput || "";

        await submission.save();
    
         if (result.isAccepted) {
        const user = await User.findById(userId);

        const previousAccepted = await Submission.findOne({
          userId,
          problemId,
          isAccepted: true,
          _id: { $ne: submission._id },
        });

         if (!previousAccepted && user) {
          user.solvedProblemsCount = (user.solvedProblemsCount || 0) + 1;
          user.totalSubmissionsCount = (user.totalSubmissionsCount || 0) + 1;
          await user.save();
        } else if (user) {
          user.totalSubmissionsCount = (user.totalSubmissionsCount || 0) + 1;
          await user.save();
        }
      } else {
        
        const user = await User.findById(userId);
        if (user) {
          user.totalSubmissionsCount = (user.totalSubmissionsCount || 0) + 1;
          await user.save();
        }
      }
       return submission.toObject();
    } catch (judgeError) {
     
      submission.verdict = "System Error";
      submission.stderr = judgeError.message;
      submission.status = 6;
      await submission.save();

      throw judgeError;
    }
  } catch (error) {
    console.error("Evaluate submission error:", error.message);
    throw error;
  }
};


export const getSubmissionHistory = async (userId, problemId = null, limit = 10) => {
    try {
        const query = { userId};
        if (problemId){
            query.problemId = problemId;
        }

        const submissions = await Submission.find(query)
        .sort({ createdAt: -1})
        .limit(limit)
        .populate('problemId', 'title slug')
        .lean();

        return submissions;
    } catch (error) {
        console.error("Error fetching submission history:", error.message);
        throw error;
    }
    };

export const getUserAcceptedProblems = async (userId) => {
    try {
        const acceptedSubmissions = await Submission.find({
            userId,
            isAccepted: true,
        })
        .distinct("problemId")
        .lean();

        return acceptedSubmissions;
    } catch (error) {
        console.error("Error fetching accepted problems:", error.message);
        throw error;
    }
};

export const getProblemSubmissions = async (problemId, limit = 50) => {
    try {
        const submissions = await Submission.find({
             problemId
            })
            .sort({ createdAt: -1})
            .limit(limit)
            .populate('userId', 'name email')
            .lean();

            return submissions;
        
    }catch (error) {
        console.error("Get problem submissions error:", error.message);
        throw error;
    }
};
