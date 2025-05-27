
import { useState, useCallback, useRef, useEffect } from 'react';

export const useSafeState = <T>(initialValue: T) => {
  const [state, setState] = useState<T>(initialValue);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const safeSetState = useCallback((newState: T | ((prev: T) => T)) => {
    if (!mountedRef.current) {
      console.log('[useSafeState] Component unmounted, skipping state update');
      return;
    }

    // Use requestAnimationFrame for better React compatibility
    requestAnimationFrame(() => {
      if (mountedRef.current) {
        setState(newState);
      }
    });
  }, []);

  return [state, safeSetState] as const;
};
