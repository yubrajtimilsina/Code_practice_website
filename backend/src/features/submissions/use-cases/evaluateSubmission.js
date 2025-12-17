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

            // ONLY UPDATE STATS FOR LEARNERS, NOT ADMINS
            if (!isAdmin) {
                // Update user stats for every learner submission (accepted or not)
                await updateUserStatistics(userId, problemId, result.isAccepted, submission._id);
                // Also update problem-level statistics
                await updateProblemStatistics(problemId, result.isAccepted);
                console.log(' User and problem stats updated');
            } else {
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

async function updateUserStatistics(userId, problemId, isAccepted, submissionId) {
    try {
        const user = await User.findById(userId);
        const problem = await Problem.findById(problemId);

        if (!user) {
            console.error('User not found:', userId);
            return;
        }

        if (user.role === 'admin' || user.role === 'super-admin') {
            console.log(' Admin detected - Skipping stats update');
            return;
        }

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
                
                console.log(' First accepted solution for this problem!');
                
                user.solvedProblemsCount = (user.solvedProblemsCount || 0) + 1;

                const difficulty = (problem.difficulty || '').toLowerCase();
                if (difficulty.includes('easy')) {
                    user.easyProblemsSolved = (user.easyProblemsSolved || 0) + 1;
                } else if (difficulty.includes('medium')) {
                    user.mediumProblemsSolved = (user.mediumProblemsSolved || 0) + 1;
                } else if (difficulty.includes('hard')) {
                    user.hardProblemsSolved = (user.hardProblemsSolved || 0) + 1;
                }

                // Recalculate rank points: Easy=10, Medium=25, Hard=50
                user.rankPoints = (user.easyProblemsSolved * 10) + 
                                 (user.mediumProblemsSolved * 25) + 
                                 (user.hardProblemsSolved * 50);
                
                console.log('Updated difficulty counts:', {
                    easy: user.easyProblemsSolved,
                    medium: user.mediumProblemsSolved,
                    hard: user.hardProblemsSolved,
                    rankPoints: user.rankPoints
                });
            }

             const now = new Date();
            const lastDate = user.lastSubmissionDate;
            
            if (!lastDate) {
                user.currentStreak = 1;
                user.longestStreak = 1;
            } else {
                const daysDiff = Math.floor((now - lastDate) / (1000 * 60 * 60 * 24));
                
                if (daysDiff === 1) {
                    user.currentStreak = (user.currentStreak || 0) + 1;
                    user.longestStreak = Math.max(user.longestStreak || 0, user.currentStreak);
                } else if (daysDiff > 1) {
                    user.currentStreak = 1;
                }
            }
            
            user.lastSubmissionDate = now;
        }
         user.lastActiveDate = new Date();

        await user.save();

        console.log(' User stats updated:', {
            totalSubmissions: user.totalSubmissionsCount,
            acceptedSubmissions: user.acceptedSubmissionsCount,
            solvedProblems: user.solvedProblemsCount,
            rankPoints: user.rankPoints,
            currentStreak: user.currentStreak,
            longestStreak: user.longestStreak
        });

    } catch (error) {
        console.error(' Error updating user stats:', error);
        
    }
}
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

export const getSubmissionHistory = async (userId, filters= {} ) => {
    try {
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