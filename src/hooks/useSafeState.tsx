
import { useState, useCallback, useRef, useEffect } from 'react';

export const useSafeState = <T>(initialValue: T) => {
  const [state, setState] = useState<T>(initialValue);
  const mountedRef = useRef(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const safeSetState = useCallback((newState: T | ((prev: T) => T)) => {
    if (!mountedRef.current) return;

    // Clear any pending state updates
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Use requestAnimationFrame for Chrome compatibility
    timeoutRef.current = setTimeout(() => {
      if (mountedRef.current) {
        setState(newState);
      }
    }, 0);
  }, []);

  return [state, safeSetState] as const;
};
