import { createProblemUseCase } from "../use-cases/createProblem.js";
import { updateProblemUseCase } from "../use-cases/updateProblem.js";
import { deleteProblemUseCase } from "../use-cases/deleteProblem.js";
import { getProblemsUseCase } from "../use-cases/getProblems.js";
import { getProblemByIdUseCase } from "../use-cases/getProblemById.js";


export const createProblemController = async (req, res) => {
  const payload = req.body;

  const problem = await createProblemUseCase(payload, req.user._id);
  
  res.status(201).json(problem);
};

export const updateProblemController = async (req, res) => {
  const id = req.params.id;
  const updates = req.body;
  
  const updated = await updateProblemUseCase(id, updates);
  
  if (!updated) {
    return res.status(404).json({ message: "Problem not found" });
  }
  
  res.json(updated);
};


export const deleteProblemController = async (req, res) => {
  const id = req.params.id;
  await deleteProblemUseCase(id);
  res.json({ message: "Deleted" });
};

export const listProblemsController = async (req, res) => {
  const { page, limit, tags, difficulty, q } = req.query;
  const data = await getProblemsUseCase({ page, limit, tags, difficulty, q });
  res.json(data);
};

export const getProblemController = async (req, res) => {
  const idOrSlug = req.params.id;
  
  const problem = await getProblemByIdUseCase(idOrSlug);
  
  if (!problem) {
    return res.status(404).json({ message: "Problem not found" });
  }

  // CRITICAL FIX: Return ALL fields including arrays
  const response = {
    _id: problem._id,
    title: problem.title,
    slug: problem.slug,
    description: problem.description,
    difficulty: problem.difficulty,
    tags: problem.tags || [],
    timeLimitSec: problem.timeLimitSec || 1,
    memoryLimitMB: problem.memoryLimitMB || 256,
    sampleInput: problem.sampleInput || "",
    sampleOutput: problem.sampleOutput || "",
    
    //  CRITICAL: Include all array fields
    examples: problem.examples || [],
    constraints: problem.constraints || [],
    hints: problem.hints || [],
    testCases: problem.testCases || [],
    
    createdBy: problem.createdBy,
    createdAt: problem.createdAt,
    updatedAt: problem.updatedAt
  };
  
  res.json(response);
};