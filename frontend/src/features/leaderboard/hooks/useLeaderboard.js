import { useCallback, useState } from "react";
import LeaderboardService from "../services/LeaderboardService";
import { useApiCall } from "../../../hooks/useApiCall";

/**
 * Custom hook for leaderboard operations
 */
export const useLeaderboard = (initialFilters = {}) => {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    ...initialFilters,
  });
  const [total, setTotal] = useState(0);

  const { execute: fetchLeaderboard, loading, error } = useApiCall(async () => {
    const result = await LeaderboardService.getLeaderboard(filters);
    if (result.success) {
      setUsers(result.data.users || []);
      setTotal(result.data.total || 0);
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
    updateFilters({ search: query, page: 1 });
  }, [updateFilters]);

  const filterByCategory = useCallback((category) => {
    updateFilters({ category, page: 1 });
  }, [updateFilters]);

  return {
    users,
    loading,
    error,
    filters,
    total,
    fetchLeaderboard,
    updateFilters,
    setPage,
    setLimit,
    search,
    filterByCategory,
  };
};

export default useLeaderboard;
