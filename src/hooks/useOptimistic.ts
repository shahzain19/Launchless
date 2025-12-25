import { useState, useCallback } from 'react';

interface OptimisticState<T> {
  data: T;
  isOptimistic: boolean;
  error: Error | null;
}

export function useOptimistic<T>(initialData: T) {
  const [state, setState] = useState<OptimisticState<T>>({
    data: initialData,
    isOptimistic: false,
    error: null
  });

  const updateOptimistic = useCallback((optimisticData: T) => {
    setState({
      data: optimisticData,
      isOptimistic: true,
      error: null
    });
  }, []);

  const confirmUpdate = useCallback((confirmedData: T) => {
    setState({
      data: confirmedData,
      isOptimistic: false,
      error: null
    });
  }, []);

  const revertOptimistic = useCallback((error: Error, fallbackData: T) => {
    setState({
      data: fallbackData,
      isOptimistic: false,
      error
    });
  }, []);

  const reset = useCallback(() => {
    setState({
      data: initialData,
      isOptimistic: false,
      error: null
    });
  }, [initialData]);

  return {
    ...state,
    updateOptimistic,
    confirmUpdate,
    revertOptimistic,
    reset
  };
}

export default useOptimistic;