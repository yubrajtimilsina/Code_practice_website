import { updateProblemById } from "../repository/problemRepository.js";

export const updateProblemUseCase = async  (id, updates) => {
  const updated = await updateProblemById(id, updates);
  return updated;
};