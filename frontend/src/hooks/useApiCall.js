import { useState, useCallback } from 'react';

export const useApiCall = (apiFunction, options = {}) => {
  const [data, setData] = useState(options.initialData || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiFunction(...args);
      const result = response.data;
      setData(result);
      
      if (options.onSuccess) {
        options.onSuccess(result);
      }
      
      return { success: true, data: result };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 
                          err.response?.data?.errors?.[0] || 
                          err.message || 
                          'An error occurred';
      
      setError(errorMessage);
      
      if (options.onError) {
        options.onError(errorMessage);
      }
      
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [apiFunction, options]);

  const reset = useCallback(() => {
    setData(options.initialData || null);
    setError(null);
    setLoading(false);
  }, [options.initialData]);

  return { data, loading, error, execute, reset };
};