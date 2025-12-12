import { createProblemUseCase } from "../use-cases/createProblem.js";
import { updateProblemUseCase } from "../use-cases/updateProblem.js";
import { deleteProblemUseCase } from "../use-cases/deleteProblem.js";
import { getProblemsUseCase } from "../use-cases/getProblems.js";
import { getProblemByIdUseCase } from "../use-cases/getProblemById.js";


export const createProblemController = async (req, res) => {
  try {
    const payload = req.body;
    console.log(" CreateProblem called");
    console.log("User:", req.user ? { id: req.user._id, role: req.user.role } : null);
    console.log("Payload received:", JSON.stringify(payload, null, 2));

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: missing user" });
    }

    const problem = await createProblemUseCase(payload, req.user._id);
    
    console.log(" Problem created successfully:");
    console.log("- Examples:", problem.examples?.length || 0);
    console.log("- Constraints:", problem.constraints?.length || 0);
    console.log("- Test Cases:", problem.testCases?.length || 0);
    console.log("- Hints:", problem.hints?.length || 0);
    
    res.status(201).json(problem);
  } catch (err) {
    console.error("Create problem error:", err);
    res.status(400).json({ message: err.message });
  }
};

export const updateProblemController = async (req, res) => {
  try {
    const id = req.params.id;
    const updates = req.body;
    
    console.log(" Updating problem:", id);
    console.log("Updates:", JSON.stringify(updates, null, 2));
    
    const updated = await updateProblemUseCase(id, updates);
    
    if (!updated) {
      return res.status(404).json({ message: "Problem not found" });
    }
    
    console.log("Problem updated successfully:");
    console.log("- Examples:", updated.examples?.length || 0);
    console.log("- Constraints:", updated.constraints?.length || 0);
    
    res.json(updated);
  } catch (err) {
    console.error(" Update problem error:", err);
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
    console.log(" Fetching problem:", idOrSlug);
    
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
    
    console.log(" Sending problem response:");
    console.log("- Title:", response.title);
    console.log("- Examples:", response.examples.length);
    console.log("- Constraints:", response.constraints.length);
    console.log("- Test Cases:", response.testCases.length);
    console.log("- Hints:", response.hints.length);
    
    // Log actual content for debugging
    if (response.examples.length > 0) {
      console.log("- First Example:", JSON.stringify(response.examples[0], null, 2));
    }
    if (response.constraints.length > 0) {
      console.log("- First Constraint:", response.constraints[0]);
    }
    
    res.json(response);
  } catch (err) {
    console.error("Get problem error:", err);
    res.status(400).json({ message: err.message });
  }
};