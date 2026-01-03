import { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';

export const useVoting = ({ voteApi, onSuccess, onError } = {}) => {
  const { user } = useSelector((state) => state.auth);
  const [voting, setVoting] = useState(false);
  const [votedItems, setVotedItems] = useState(new Set());

  const hasUserUpvoted = useCallback((upvotes) => {
    if (!user || !upvotes || !Array.isArray(upvotes)) return false;
    
    return upvotes.some(vote => {
      // Handle both string IDs and user objects
      const voteId = typeof vote === 'object' ? (vote._id || vote.id) : vote;
      return voteId === user.id || voteId === user._id;
    });
  }, [user]);

  const getOptimisticCount = useCallback((upvotes, hasUpvoted) => {
    const currentCount = Array.isArray(upvotes) ? upvotes.length : 0;
    return hasUpvoted ? currentCount - 1 : currentCount + 1;
  }, []);

  const toggleVote = useCallback(async (itemId, currentUpvotes, updateState) => {
    if (!user) {
      if (onError) {
        onError({ message: 'Please login to vote' });
      }
      return { success: false, error: 'Not authenticated' };
    }

    if (!voteApi) {
      console.error('voteApi function not provided to useVoting hook');
      return { success: false, error: 'API function not configured' };
    }

    if (voting) {
      return { success: false, error: 'Vote in progress' };
    }

    setVoting(true);
    setVotedItems(prev => new Set([...prev, itemId]));

    const hasUpvoted = hasUserUpvoted(currentUpvotes);
    const previousUpvotes = [...currentUpvotes];

    // Optimistic update
    const optimisticUpvotes = hasUpvoted
      ? currentUpvotes.filter(vote => {
          const voteId = typeof vote === 'object' ? (vote._id || vote.id) : vote;
          return voteId !== user.id && voteId !== user._id;
        })
      : [...currentUpvotes, user.id];

    updateState(optimisticUpvotes);

    try {
      // Call the API
      await voteApi(itemId);
      
      if (onSuccess) {
        onSuccess({ itemId, hasUpvoted: !hasUpvoted });
      }

      return { success: true, hasUpvoted: !hasUpvoted };
    } catch (error) {
      console.error('Vote failed:', error);
      
      // Rollback on failure
      updateState(previousUpvotes);
      
      if (onError) {
        onError(error);
      }

      return { 
        success: false, 
        error: error.message || 'Failed to vote' 
      };
    } finally {
      setVoting(false);
      // Remove from voting set after a short delay
      setTimeout(() => {
        setVotedItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(itemId);
          return newSet;
        });
      }, 500);
    }
  }, [user, voteApi, voting, hasUserUpvoted, onSuccess, onError]);

  const isVoting = useCallback((itemId) => {
    return votedItems.has(itemId);
  }, [votedItems]);

  const createVoteHandler = useCallback((items, updateItemState) => {
    return {
      handleVote: async (itemId) => {
        const item = items.find(i => i._id === itemId || i.id === itemId);
        if (!item) return { success: false, error: 'Item not found' };

        return await toggleVote(
          itemId,
          item.upvotes || [],
          (newUpvotes) => updateItemState(itemId, { upvotes: newUpvotes })
        );
      },
      isVoting: (itemId) => isVoting(itemId),
      hasUpvoted: (item) => hasUserUpvoted(item.upvotes || [])
    };
  }, [toggleVote, isVoting, hasUserUpvoted]);

  return {
    // Main functions
    toggleVote,
    hasUserUpvoted,
    getOptimisticCount,
    
    // State
    voting,
    isVoting,
    
    // Helpers
    createVoteHandler,
    
    // User state
    isAuthenticated: !!user
  };
};

export const useDiscussionVoting = (voteDiscussionApi, options = {}) => {
  return useVoting({
    voteApi: voteDiscussionApi,
    ...options
  });
};

export const useCommentVoting = (voteCommentApi, options = {}) => {
  return useVoting({
    voteApi: voteCommentApi,
    ...options
  });
};

export default useVoting;