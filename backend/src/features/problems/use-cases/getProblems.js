import { getProblems } from "../repository/problemRepository.js";

export const getProblemsUseCase = async ({ page = 1, limit = 20, tags, difficulty, q }) => {
  const filter = {};
  if (tags) filter.tags = { $in: tags.split(",").map(t => t.trim()) };
  if (difficulty) filter.difficulty = difficulty;
  if (q) filter.$text = { $search: q }; // require text index if you want search
  return await getProblems(filter, { page: Number(page), limit: Number(limit) });
};
