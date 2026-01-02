
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { PAGINATION } from '../utils/constants';

// ============= DATA FETCHING HOOK =============
export const useDataFetch = (fetchFunction, options = {}) => {
  const {
    initialData = null,
    autoFetch = false,
    dependencies = [],
    onSuccess,
    onError
  } = options;

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isMounted = useRef(true);

  const execute = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await fetchFunction(...args);
      
      if (!isMounted.current) return;
      
      if (result.success) {
        setData(result.data);
        onSuccess?.(result.data);
        return result;
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      if (!isMounted.current) return;
      
      const errorMessage = err.message || 'An error occurred';
      setError(errorMessage);
      onError?.(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [fetchFunction, onSuccess, onError]);

  useEffect(() => {
    if (autoFetch) {
      execute();
    }
    
    return () => {
      isMounted.current = false;
    };
  }, dependencies);

  const reset = useCallback(() => {
    setData(initialData);
    setError(null);
    setLoading(false);
  }, [initialData]);

  return { 
    data, 
    loading, 
    error, 
    execute, 
    reset, 
    refetch: execute,
    isLoading: loading,
    isError: !!error
  };
};

// ============= PAGINATION HOOK =============
export const usePagination = (initialPage = PAGINATION.DEFAULT_PAGE, initialLimit = PAGINATION.DEFAULT_LIMIT) => {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [total, setTotal] = useState(0);

  const totalPages = useMemo(() => Math.ceil(total / limit), [total, limit]);

  const goToPage = useCallback((newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [totalPages]);

  const nextPage = useCallback(() => {
    goToPage(page + 1);
  }, [page, goToPage]);

  const prevPage = useCallback(() => {
    goToPage(page - 1);
  }, [page, goToPage]);

  const changeLimit = useCallback((newLimit) => {
    setLimit(newLimit);
    setPage(1);
  }, []);

  const reset = useCallback(() => {
    setPage(initialPage);
    setLimit(initialLimit);
    setTotal(0);
  }, [initialPage, initialLimit]);

  return {
    page,
    limit,
    total,
    totalPages,
    setPage: goToPage,
    setLimit: changeLimit,
    setTotal,
    nextPage,
    prevPage,
    reset,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1
  };
};

// ============= FILTER HOOK =============
export const useFilters = (initialFilters = {}) => {
  const [filters, setFilters] = useState(initialFilters);

  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const clearFilter = useCallback((key) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  }, []);

  const activeFilters = useMemo(() => {
    return Object.entries(filters)
      .filter(([_, value]) => value !== '' && value !== null && value !== undefined && value !== 'all')
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
  }, [filters]);

  return {
    filters,
    activeFilters,
    updateFilter,
    updateFilters,
    resetFilters,
    clearFilter,
    hasFilters: Object.keys(activeFilters).length > 0
  };
};

// ============= DEBOUNCE HOOK =============
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

// ============= TOGGLE HOOK =============
export const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue(v => !v);
  }, []);

  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);

  return [value, toggle, setTrue, setFalse, setValue];
};

// ============= AUTH HOOK =============
export const useAuth = () => {
  const { user, token, loading } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const isAuthenticated = !!user && !!token;
  const isAdmin = user?.role === 'admin' || user?.role === 'super-admin';
  const isSuperAdmin = user?.role === 'super-admin';
  const isLearner = user?.role === 'learner';

  const requireAuth = useCallback((redirectTo = '/login') => {
    if (!isAuthenticated) {
      navigate(redirectTo);
      return false;
    }
    return true;
  }, [isAuthenticated, navigate]);

  const requireRole = useCallback((roles = [], redirectTo = '/dashboard') => {
    if (!isAuthenticated || !roles.includes(user?.role)) {
      navigate(redirectTo);
      return false;
    }
    return true;
  }, [isAuthenticated, user, navigate]);

  return {
    user,
    token,
    loading,
    isAuthenticated,
    isAdmin,
    isSuperAdmin,
    isLearner,
    requireAuth,
    requireRole
  };
};

// ============= PREVIOUS VALUE HOOK =============
export const usePrevious = (value) => {
  const ref = useRef();
  
  useEffect(() => {
    ref.current = value;
  }, [value]);
  
  return ref.current;
};

// ============= MOUNTED HOOK =============
export const useIsMounted = () => {
  const isMounted = useRef(true);
  
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  return isMounted;
};

// ============= LOCAL STORAGE HOOK =============
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }, [key, storedValue]);

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
};

// ============= QUERY PARAMS HOOK =============
export const useQueryParams = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  
  const getParam = useCallback((key) => {
    return queryParams.get(key);
  }, [queryParams]);

  const setParam = useCallback((key, value) => {
    const newParams = new URLSearchParams(queryParams);
    newParams.set(key, value);
    navigate({ search: newParams.toString() });
  }, [queryParams, navigate]);

  const removeParam = useCallback((key) => {
    const newParams = new URLSearchParams(queryParams);
    newParams.delete(key);
    navigate({ search: newParams.toString() });
  }, [queryParams, navigate]);

  return { queryParams, getParam, setParam, removeParam };
};

// ============= WINDOW SIZE HOOK =============
export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

// ============= FORM HOOK =============
export const useForm = (initialValues = {}, validationSchema = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setValues(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }, []);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  }, []);

  const validate = useCallback(() => {
    const newErrors = {};
    Object.keys(validationSchema).forEach(key => {
      const validator = validationSchema[key];
      const error = validator(values[key], values);
      if (error) {
        newErrors[key] = error;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [values, validationSchema]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validate,
    reset,
    setValues,
    setErrors
  };
};

// ============= ASYNC HOOK =============
export const useAsync = (asyncFunction, immediate = true) => {
  const [status, setStatus] = useState('idle');
  const [value, setValue] = useState(null);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setStatus('pending');
    setValue(null);
    setError(null);

    try {
      const response = await asyncFunction(...args);
      setValue(response);
      setStatus('success');
      return response;
    } catch (error) {
      setError(error);
      setStatus('error');
      throw error;
    }
  }, [asyncFunction]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return {
    execute,
    status,
    value,
    error,
    isIdle: status === 'idle',
    isPending: status === 'pending',
    isSuccess: status === 'success',
    isError: status === 'error'
  };
};

// Export all hooks as default object
export default {
  useDataFetch,
  usePagination,
  useFilters,
  useDebounce,
  useToggle,
  useAuth,
  usePrevious,
  useIsMounted,
  useLocalStorage,
  useQueryParams,
  useWindowSize,
  useForm,
  useAsync
};