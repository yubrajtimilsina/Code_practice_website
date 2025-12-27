import User from "../../auth/models/UserModels.js";
import Problem from "../../problems/models/ProblemModel.js";
import Submission from "../../submissions/models/submissionModel.js";

function updateStreak(user) {
  const now = new Date();
  const lastDate = user.lastSubmissionDate;

  if (!lastDate) {
    user.currentStreak = 1;
    user.longestStreak = 1;
  } else {
    const daysDiff = Math.floor((now - lastDate) / (1000 * 60 * 60 * 24));

    if (daysDiff === 0) {
      // Same day - no streak change
    } else if (daysDiff === 1) {
      // Consecutive day - increment streak
      user.currentStreak = (user.currentStreak || 0) + 1;
      user.longestStreak = Math.max(user.longestStreak || 0, user.currentStreak);
    } else {
      // Gap in streak - reset
      user.currentStreak = 1;
    }
  }
  user.lastSubmissionDate = now;
}

export async function updateUserStatistics(userId, problemId, isAccepted, submissionId) {
  const user = await User.findById(userId);
  const problem = await Problem.findById(problemId);

  if (!user) {
    throw new Error("User not found");
  }
  if (!problem) {
    throw new Error("Problem not found");
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

    if (!previousAccepted) {
      user.solvedProblemsCount = (user.solvedProblemsCount || 0) + 1;

      const difficulty = (problem.difficulty || '').toLowerCase();
      switch (difficulty) {
        case 'easy':
          user.easyProblemsSolved = (user.easyProblemsSolved || 0) + 1;
          break;
        case 'medium':
          user.mediumProblemsSolved = (user.mediumProblemsSolved || 0) + 1;
          break;
        case 'hard':
          user.hardProblemsSolved = (user.hardProblemsSolved || 0) + 1;
          break;
      }

      // Recalculate rank points: Easy=10, Medium=25, Hard=50
      user.rankPoints = (user.easyProblemsSolved * 10) +
                       (user.mediumProblemsSolved * 25) +
                       (user.hardProblemsSolved * 50);

    }

    updateStreak(user);
  }

  user.lastActiveDate = new Date();

  await user.save();
}

export async function updateProblemStatistics(problemId, isAccepted) {
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
}

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