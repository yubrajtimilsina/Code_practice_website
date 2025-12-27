import Problem from "../models/ProblemModel.js";
import Submission from "../../submissions/models/submissionModel.js";

export const getProblemStatistics = async (problemId) => {
  const problem = await Problem.findById(problemId).lean();
  if (!problem) {
    throw new Error("Problem not found");
  }

  const submissions = await Submission.find({ problemId })
    .select('verdict language executionTime memoryUsed userId createdAt')
    .lean();

  const stats = {
    totalSubmissions: submissions.length,
    acceptedSubmissions: submissions.filter(s => s.verdict === 'Accepted').length,
    wrongAnswers: submissions.filter(s => s.verdict === 'Wrong Answer').length,
    timeoutErrors: submissions.filter(s => s.verdict === 'Time Limit Exceeded').length,
    runtimeErrors: submissions.filter(s => s.verdict.includes('Runtime Error')).length,
    compilationErrors: submissions.filter(s => s.verdict === 'Compilation Error').length
  };

  stats.acceptanceRate = stats.totalSubmissions > 0
    ? ((stats.acceptedSubmissions / stats.totalSubmissions) * 100).toFixed(2)
    : 0;

  const languageStats = {};
  submissions.forEach(sub => {
    languageStats[sub.language] = (languageStats[sub.language] || 0) + 1;
  });

  const acceptedSolutions = submissions.filter(s => s.verdict === 'Accepted' && s.executionTime);
  const avgExecutionTime = acceptedSolutions.length > 0
    ? (acceptedSolutions.reduce((sum, s) => {
        const time = parseFloat(s.executionTime.replace('ms', ''));
        return sum + (isNaN(time) ? 0 : time);
      }, 0) / acceptedSolutions.length).toFixed(2)
    : 0;

  const uniqueSolvers = new Set(
    submissions.filter(s => s.verdict === 'Accepted').map(s => s.userId.toString())
  ).size;

  return {
    problem: {
      title: problem.title,
      difficulty: problem.difficulty,
      tags: problem.tags
    },
    stats,
    languageStats,
    avgExecutionTime: `${avgExecutionTime}ms`,
    uniqueSolvers,
    recentSubmissions: submissions.slice(0, 20)
  };
};
