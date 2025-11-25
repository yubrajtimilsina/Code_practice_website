import { deleteProblemById } from "../repository/problemRepository.js";

export const deleteProblemUseCase = async (id) => {
  return await deleteProblemById(id);
};
