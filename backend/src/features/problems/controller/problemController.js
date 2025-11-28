import { createProblemUseCase } from "../use-cases/createProblem.js";
import { updateProblemUseCase } from "../use-cases/updateProblem.js";
import { deleteProblemUseCase } from "../use-cases/deleteProblem.js";
import { getProblemsUseCase } from "../use-cases/getProblems.js";
import { getProblemByIdUseCase } from "../use-cases/getProblemById.js";


export const createProblemController = async (req, res) => {
  try {
    const payload = req.body;
    console.log("CreateProblem called - user:", req.user ? { id: req.user._id, role: req.user.role } : null);
    console.log("Payload:", payload);

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: missing user (auth middleware did not set req.user)" });
    }

    const problem = await createProblemUseCase(payload, req.user._id);
    res.status(201).json(problem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateProblemController = async (req, res) => {
  try {
    const id = req.params.id;
    const updates = req.body;
    const updated = await updateProblemUseCase(id, updates);
    if (!updated) return res.status(404).json({ message: "Problem not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteProblemController = async (req, res) => {
  try {
    const id = req.params.id;
    await deleteProblemUseCase(id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const listProblemsController = async (req, res) => {
  try {
    const { page, limit, tags, difficulty, q } = req.query;
    const data = await getProblemsUseCase({ page, limit, tags, difficulty, q });
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getProblemController = async (req, res) => {
  try {
    const idOrSlug = req.params.id;
    const problem = await getProblemByIdUseCase(idOrSlug);
    if (!problem) return res.status(404).json({ message: "Not found" });
    // hide hidden testcases — the model already stores them; do not include testCases for learners
    // only include sample inputs/outputs and metadata
    const safe = {
      _id: problem._id,
      title: problem.title,
      slug: problem.slug,
      description: problem.description,
      difficulty: problem.difficulty,
      tags: problem.tags,
      timeLimitSec: problem.timeLimitSec,
      memoryLimitMB: problem.memoryLimitMB,
      sampleInput: problem.sampleInput,
      sampleOutput: problem.sampleOutput,
      createdBy: problem.createdBy,
      createdAt: problem.createdAt
    };
    res.json(safe);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};