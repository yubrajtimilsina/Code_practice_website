import Problem from "../models/ProblemModel.js";

export const createProblem = async (problemObj) => {
    const p = new Problem(problemObj);
    return await p.save();
};

export const updateProblemById = async (id, updates) => {
    return await Problem.findByIdAndUpdate(id, updates, { new: true });
};

export const deleteProblemById = async (id) => {
    return await Problem.findByIdAndDelete(id);
};

export const findProblemById = async (id) => {
    return await Problem.findById(id).lean();
};

export const findProblemBySlug = async (slug) => {
    return await Problem.findOne({ slug }).lean();
};

export const getProblems = async (filter = {}, options = {}) => {
    const { page =1, limit = 20, sort = { createdAt: -1 } } = options;
    const skip = (page - 1) * limit;
    const query = Problem.find(filter).sort(sort).skip(skip).limit(limit);
    const items = await query.lean();
    const total = await Problem.countDocuments(filter);
    return {
        items,
        total,
        page,
        limit
    };
};