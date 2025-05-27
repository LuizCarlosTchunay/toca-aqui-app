
import { useCallback, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export const useChromeCompatibleNavigation = () => {
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = useState(false);
  const navigationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debugLog = useCallback((message: string, data?: any) => {
    console.log(`[Chrome Navigation Debug] ${message}`, data);
  }, []);

  const safeNavigate = useCallback((path: string, options?: { replace?: boolean }) => {
    if (isNavigating) {
      debugLog('Navigation already in progress, skipping');
      return;
    }

    debugLog('Starting navigation to:', path);
    setIsNavigating(true);

    // Clear any existing timeout
    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current);
    }

    try {
      // Multiple fallback strategies for Chrome
      const attemptNavigation = () => {
        try {
          debugLog('Attempting React Router navigation');
          navigate(path, options);
          
          // Set a timeout to reset navigation state
          navigationTimeoutRef.current = setTimeout(() => {
            setIsNavigating(false);
            debugLog('Navigation state reset via timeout');
          }, 2000);
          
        } catch (error) {
          debugLog('React Router navigation failed, trying window.location', error);
          
          // Fallback to window.location
          try {
            if (options?.replace) {
              window.location.replace(path);
            } else {
              window.location.href = path;
            }
          } catch (locationError) {
            debugLog('Window.location navigation also failed', locationError);
            setIsNavigating(false);
          }
        }
      };

      // Use requestIdleCallback if available (Chrome optimization)
      if ('requestIdleCallback' in window) {
        debugLog('Using requestIdleCallback for navigation');
        window.requestIdleCallback(attemptNavigation, { timeout: 1000 });
      } else {
        debugLog('Using setTimeout for navigation');
        setTimeout(attemptNavigation, 16); // ~1 frame
      }

    } catch (error) {
      debugLog('Navigation setup failed', error);
      setIsNavigating(false);
    }
  }, [navigate, isNavigating, debugLog]);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current);
      navigationTimeoutRef.current = null;
    }
    setIsNavigating(false);
  }, []);

  return {
    safeNavigate,
    isNavigating,
    cleanup,
    debugLog
  };
};
