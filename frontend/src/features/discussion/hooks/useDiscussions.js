import { useCallback, useState } from "react";
import DiscussionService from "../services/DiscussionService";
import { useApiCall } from "../../../hooks/useApiCall";


export const useDiscussions = (initialFilters = {}) => {
  const [discussions, setDiscussions] = useState([]);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    ...initialFilters,
  });
  const [total, setTotal] = useState(0);

  const apiFunction = useCallback(async () => {
    const result = await DiscussionService.getDiscussions(filters);
    if (result.success) {
      setDiscussions(result.data.items || []);
      setTotal(result.data.total || 0);
      return result.data;
    } else {
      throw new Error(result.error);
    }
  }, [filters]);

  const { execute: fetchDiscussions, loading, error } = useApiCall(apiFunction);

  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const setPage = useCallback((page) => {
    updateFilters({ page });
  }, [updateFilters]);

  const search = useCallback((query) => {
    updateFilters({ search: query, page: 1 });
  }, [updateFilters]);

  return {
    discussions,
    loading,
    error,
    filters,
    total,
    fetchDiscussions,
    updateFilters,
    setPage,
    search,
  };
};


export const useDiscussion = (discussionId) => {
  const [discussion, setDiscussion] = useState(null);

  const { execute: fetchDiscussion, loading, error } = useApiCall(async () => {
    const result = await DiscussionService.getDiscussionDetails(discussionId);
    if (result.success) {
      setDiscussion(result.data);
      return result.data;
    } else {
      throw new Error(result.error);
    }
  });

  return {
    discussion,
    loading,
    error,
    refetch: fetchDiscussion,
  };
};

export default useDiscussions;
