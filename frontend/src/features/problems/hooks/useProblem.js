import { useCallback, useState, useEffect } from "react";
import ProblemService from "../services/ProblemService";
import { useApiCall } from "../../../hooks/useApiCall";

/**
 * Custom hook for problem operations
 */
export const useProblem = (idOrSlug) => {
  const [problem, setProblem] = useState(null);

  const { execute: fetchProblem, loading, error } = useApiCall(async () => {
    const result = await ProblemService.getProblemDetails(idOrSlug);
    if (result.success) {
      setProblem(result.data);
      return result.data;
    } else {
      throw new Error(result.error);
    }
  });

  useEffect(() => {
    if (idOrSlug) {
      fetchProblem();
    }
  }, [idOrSlug]);

  return {
    problem,
    loading,
    error,
    refetch: fetchProblem,
  };
};

export default useProblem;
