import { useState, useEffect, useCallback } from 'react';
import { LoadingState } from '../types';

interface UseApiOptions {
  immediate?: boolean;
}

interface UseApiResult<T> extends LoadingState {
  data: T | null;
  execute: (...args: any[]) => Promise<void>;
  reset: () => void;
}

export function useApi<T>(
  apiFunction: (...args: any[]) => Promise<T>,
  options: UseApiOptions = { immediate: false }
): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (...args: any[]) => {
      setIsLoading(true);
      setError(null);
      
      try {
        const result = await apiFunction(...args);
        setData(result);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
        setError(errorMessage);
        console.error('API Error:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [apiFunction]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  // Use a separate effect for immediate execution to avoid dependency issues
  useEffect(() => {
    if (options.immediate) {
      const executeImmediate = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
          const result = await apiFunction();
          setData(result);
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
          setError(errorMessage);
          console.error('API Error:', err);
        } finally {
          setIsLoading(false);
        }
      };
      executeImmediate();
    }
  }, [apiFunction, options.immediate]);

  return { data, isLoading, error, execute, reset };
}