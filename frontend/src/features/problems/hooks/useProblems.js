import { useCallback, useState } from "react";
import ProblemService from "../services/ProblemService";
import { useApiCall } from "../../../hooks/useApiCall";

/**
 * Custom hook for problem list operations
 */
export const useProblems = (initialFilters = {}) => {
  const [problems, setProblems] = useState([]);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    ...initialFilters,
  });
  const [totalProblems, setTotalProblems] = useState(0);

  const { execute: fetchProblems, loading, error } = useApiCall(async () => {
    const result = await ProblemService.getProblems(filters);
    if (result.success) {
      setProblems(result.data.items || []);
      setTotalProblems(result.data.total || 0);
      return result.data;
    } else {
      throw new Error(result.error);
    }
  });

  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const setPage = useCallback((page) => {
    updateFilters({ page });
  }, [updateFilters]);

  const setLimit = useCallback((limit) => {
    updateFilters({ limit, page: 1 });
  }, [updateFilters]);

  const search = useCallback((query) => {
    updateFilters({ q: query, page: 1 });
  }, [updateFilters]);

  const filterByDifficulty = useCallback((difficulty) => {
    updateFilters({ difficulty, page: 1 });
  }, [updateFilters]);

  const filterByTags = useCallback((tags) => {
    updateFilters({ tags: Array.isArray(tags) ? tags.join(",") : tags, page: 1 });
  }, [updateFilters]);

  return {
    problems,
    loading,
    error,
    filters,
    totalProblems,
    fetchProblems,
    updateFilters,
    setPage,
    setLimit,
    search,
    filterByDifficulty,
    filterByTags,
  };
};

export default useProblems;
