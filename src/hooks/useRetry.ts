import { useState, useCallback } from 'react';

interface RetryOptions {
  maxAttempts?: number;
  delay?: number;
  backoff?: boolean;
}

interface RetryState {
  isRetrying: boolean;
  attempt: number;
  error: Error | null;
}

export function useRetry<T>(
  asyncFunction: () => Promise<T>,
  options: RetryOptions = {}
) {
  const { maxAttempts = 3, delay = 1000, backoff = true } = options;
  
  const [state, setState] = useState<RetryState>({
    isRetrying: false,
    attempt: 0,
    error: null
  });

  const execute = useCallback(async (): Promise<T> => {
    setState(prev => ({ ...prev, isRetrying: true, error: null }));
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        setState(prev => ({ ...prev, attempt }));
        const result = await asyncFunction();
        setState(prev => ({ ...prev, isRetrying: false, attempt: 0 }));
        return result;
      } catch (error) {
        const isLastAttempt = attempt === maxAttempts;
        
        if (isLastAttempt) {
          setState(prev => ({ 
            ...prev, 
            isRetrying: false, 
            error: error as Error 
          }));
          throw error;
        }
        
        // Wait before retrying
        const waitTime = backoff ? delay * Math.pow(2, attempt - 1) : delay;
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
    
    throw new Error('Max retry attempts reached');
  }, [asyncFunction, maxAttempts, delay, backoff]);

  const reset = useCallback(() => {
    setState({ isRetrying: false, attempt: 0, error: null });
  }, []);

  return {
    execute,
    reset,
    ...state
  };
}