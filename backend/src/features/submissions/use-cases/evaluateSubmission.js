import { submitToJudge0, pollResult } from "../services/judge0Service.js";
import Submission from "../models/submissionModel.js";
import Problem from "../../problems/models/ProblemModel.js";
import User from "../../auth/models/UserModels.js";

export const evaluateSubmission = async (userId, problemId, code, language) => {
    try {
        if (!userId || !problemId || !code || !language) {
            const error = new Error("Missing required parameters for evaluating submission.");
            error.statusCode = 400;
            throw error;
        }

        console.log(' Evaluating submission:', { userId, problemId, language });

        const problem = await Problem.findById(problemId);
        if (!problem) {
            const error = new Error("Problem not found");
            error.statusCode = 404;
            throw error;
        }

        //  CHECK USER ROLE
        const user = await User.findById(userId);
        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }

        const isAdmin = user.role === 'admin' || user.role === 'super-admin';

        // Create initial submission record
        let submission = await Submission.create({
            userId,
            problemId,
            code,
            language,
            verdict: isAdmin ? "Test Run (Admin)" : "Pending", // Mark admin submissions
            status: 0,
        });

        console.log(` Submission created: ${submission._id} ${isAdmin ? '(Admin Test Mode)' : ''}`);

        try {
            // Submit to Judge0
            const judge0Token = await submitToJudge0(
                code,
                language,
                problem.sampleInput || "",
                problem.sampleOutput || ""
            );

            submission.judge0Token = judge0Token;
            await submission.save();

            console.log(' Waiting for Judge0 result...');

            const result = await pollResult(judge0Token);

            console.log(' Judge0 result received:', {
                verdict: result.verdict,
                status: result.status,
                isAccepted: result.isAccepted,
                isAdmin
            });

            let finalVerdict = result.verdict;
            
            // Double-check verdict accuracy
            if (result.verdict === "Accepted" && !result.isAccepted) {
                finalVerdict = "Wrong Answer";
            }

            //  For admins, prefix verdict with "Test -"
            if (isAdmin) {
                finalVerdict = `Test - ${finalVerdict}`;
            }

            // Update submission with results
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

            console.log(` Submission updated with verdict: ${submission.verdict}`);

            //  ONLY UPDATE STATS FOR LEARNERS, NOT ADMINS
            if (!isAdmin && result.isAccepted) {
                await updateUserStatistics(userId, problemId, result.isAccepted, submission._id);
                await updateProblemStatistics(problemId, result.isAccepted);
                console.log(' User and problem stats updated');
            } else if (isAdmin) {
                console.log(' Admin test mode - Stats NOT updated');
            }

            return submission.toObject();
        } catch (judgeError) {
            console.error(' Judge0 evaluation error:', judgeError.message);

            submission.verdict = isAdmin ? "Test - System Error" : "System Error";
            submission.stderr = judgeError.message;
            submission.status = 13; // Internal Error
            await submission.save();

            throw judgeError;
        }
    } catch (error) {
        console.error(" Evaluate submission error:", error.message);
        throw error;
    }
};

//  Update user statistics (only for learners)
async function updateUserStatistics(userId, problemId, isAccepted, submissionId) {
    try {
        const user = await User.findById(userId);
        const problem = await Problem.findById(problemId);

        if (!user) {
            console.error('User not found:', userId);
            return;
        }

        //  DOUBLE CHECK: Don't update stats for admins
        if (user.role === 'admin' || user.role === 'super-admin') {
            console.log(' Admin detected - Skipping stats update');
            return;
        }

        // Always increment total submissions
        user.totalSubmissionsCount = (user.totalSubmissionsCount || 0) + 1;

        if (isAccepted) {
            // Increment accepted submissions
            user.acceptedSubmissionsCount = (user.acceptedSubmissionsCount || 0) + 1;

            // Check if this is the FIRST accepted solution for this problem
            const previousAccepted = await Submission.findOne({
                userId,
                problemId,
                isAccepted: true,
                _id: { $ne: submissionId },
            });

            if (!previousAccepted && problem) {
                //  First time solving this problem!
                console.log(' First accepted solution for this problem!');
                
                user.solvedProblemsCount = (user.solvedProblemsCount || 0) + 1;

                // Update difficulty-specific counts
                if (problem.difficulty === 'Easy') {
                    user.easyProblemsSolved = (user.easyProblemsSolved || 0) + 1;
                } else if (problem.difficulty === 'Medium') {
                    user.mediumProblemsSolved = (user.mediumProblemsSolved || 0) + 1;
                } else if (problem.difficulty === 'Hard') {
                    user.hardProblemsSolved = (user.hardProblemsSolved || 0) + 1;
                }

                // Recalculate rank points
                user.rankPoints = user.calculateRankPoints();
                
                console.log('Updated stats:', {
                    solvedProblems: user.solvedProblemsCount,
                    rankPoints: user.rankPoints,
                    difficulty: problem.difficulty
                });
            }

            // Update streak for accepted submissions
            user.updateStreak();
        }

        // Update last active date
        user.lastActiveDate = new Date();

        await user.save();

        console.log(' User stats updated:', {
            totalSubmissions: user.totalSubmissionsCount,
            acceptedSubmissions: user.acceptedSubmissionsCount,
            solvedProblems: user.solvedProblemsCount,
            rankPoints: user.rankPoints,
            streak: user.currentStreak
        });

    } catch (error) {
        console.error(' Error updating user stats:', error);
    }
}

// Update problem statistics (only count learner submissions)
async function updateProblemStatistics(problemId, isAccepted) {
    try {
        const problem = await Problem.findById(problemId);
        if (!problem) return;

        problem.totalSubmissions = (problem.totalSubmissions || 0) + 1;
        
        if (isAccepted) {
            problem.acceptedSubmissions = (problem.acceptedSubmissions || 0) + 1;
        }

        // Recalculate acceptance rate
        if (problem.totalSubmissions > 0) {
            problem.acceptanceRate = ((problem.acceptedSubmissions / problem.totalSubmissions) * 100).toFixed(2);
        }

        await problem.save();

        console.log(' Problem stats updated:', {
            total: problem.totalSubmissions,
            accepted: problem.acceptedSubmissions,
            rate: problem.acceptanceRate
        });
    } catch (error) {
        console.error(' Error updating problem stats:', error);
    }
}

export const getSubmissionHistory = async (userId, problemId = null, limit = 10) => {
    try {
        const query = { userId };
        if (problemId) {
            query.problemId = problemId;
        }

        const submissions = await Submission.find(query)
            .sort({ createdAt: -1 })
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
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate('userId', 'name email')
            .lean();

        return submissions;
    } catch (error) {
        console.error("Get problem submissions error:", error.message);
        throw error;
    }
};