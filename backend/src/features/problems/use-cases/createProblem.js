import { createProblem } from "../repository/problemRepository.js  ";

import slugify from "slugify";

export const createProblemUseCase = async (payload, userId) => {
    const slug = payload.slug || slugify(payload.title || "problem", { lower: true, strict: true });
    const problem = await createProblem({
        ...payload,
        slug,
        createdBy: userId
    });
    return problem;
};

