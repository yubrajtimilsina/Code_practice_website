import { findProblemById, findProblemBySlug } from "../repository/problemRepository.js";

export const getProblemByIdUseCase = async (idOrSlug) => {
  // accept Mongo id or slug
  if (idOrSlug.match && idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
    return await findProblemById(idOrSlug);
  }
  return await findProblemBySlug(idOrSlug);
};
