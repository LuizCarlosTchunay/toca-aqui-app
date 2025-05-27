
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface DebugInfo {
  userAgent: string;
  isChrome: boolean;
  reactVersion: string;
  timestamp: string;
  authState: 'loading' | 'authenticated' | 'unauthenticated';
  currentUrl: string;
  errors: string[];
}

const ChromeDebugPanel = () => {
  const { user, loading } = useAuth();
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateDebugInfo = () => {
      const info: DebugInfo = {
        userAgent: navigator.userAgent,
        isChrome: /Chrome/.test(navigator.userAgent) && !/Edge/.test(navigator.userAgent),
        reactVersion: React.version,
        timestamp: new Date().toISOString(),
        authState: loading ? 'loading' : (user ? 'authenticated' : 'unauthenticated'),
        currentUrl: window.location.href,
        errors: []
      };

      setDebugInfo(info);
      console.log('[Chrome Debug] Updated debug info:', info);
    };

    updateDebugInfo();
    
    // Update every 5 seconds
    const interval = setInterval(updateDebugInfo, 5000);
    
    return () => clearInterval(interval);
  }, [user, loading]);

  // Listen for errors
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('[Chrome Debug] Error caught:', event.error);
      setDebugInfo(prev => prev ? {
        ...prev,
        errors: [...prev.errors.slice(-4), `${event.error?.message || 'Unknown error'} at ${new Date().toLocaleTimeString()}`]
      } : null);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('[Chrome Debug] Unhandled rejection:', event.reason);
      setDebugInfo(prev => prev ? {
        ...prev,
        errors: [...prev.errors.slice(-4), `Promise rejection: ${event.reason} at ${new Date().toLocaleTimeString()}`]
      } : null);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  // Toggle visibility with Ctrl+Shift+D
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'D') {
        setIsVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isVisible || !debugInfo) return null;

  return (
    <div className="fixed top-4 right-4 bg-black/90 text-white p-4 rounded-lg z-[9999] max-w-md text-xs font-mono border border-red-500">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-red-400">Chrome Debug Panel</h3>
        <button 
          onClick={() => setIsVisible(false)}
          className="text-red-400 hover:text-red-300"
        >
          ×
        </button>
      </div>
      
      <div className="space-y-1">
        <div>Browser: {debugInfo.isChrome ? '✅ Chrome' : '❌ Not Chrome'}</div>
        <div>Auth: {debugInfo.authState}</div>
        <div>React: {debugInfo.reactVersion}</div>
        <div>URL: {debugInfo.currentUrl.split('/').pop()}</div>
        <div>Time: {new Date(debugInfo.timestamp).toLocaleTimeString()}</div>
        
        {debugInfo.errors.length > 0 && (
          <div className="mt-2">
            <div className="text-red-400 font-bold">Recent Errors:</div>
            {debugInfo.errors.map((error, i) => (
              <div key={i} className="text-red-300 text-xs">{error}</div>
            ))}
          </div>
        )}
      </div>
      
      <div className="mt-2 text-gray-400">
        Press Ctrl+Shift+D to toggle
      </div>
    </div>
  );
};

export default ChromeDebugPanel;
