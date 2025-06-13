
import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const usePWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Check if app is already installed
    const checkInstalled = () => {
      // Check if running as PWA
      if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
        return true;
      }
      
      // Check if iOS PWA
      if (window.navigator && (window.navigator as any).standalone) {
        setIsInstalled(true);
        return true;
      }
      
      return false;
    };

    const installed = checkInstalled();
    console.log('PWA Status - Is installed:', installed);

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('beforeinstallprompt event fired - PWA is installable');
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      console.log('App was installed successfully');
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    // Listen for online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // Add event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Enhanced PWA criteria check for mobile browsers
    if (!installed && 'serviceWorker' in navigator) {
      const checkPWACriteria = () => {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isSecure = location.protocol === 'https:' || location.hostname === 'localhost';
        const hasManifest = document.querySelector('link[rel="manifest"]');
        const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
        const isEdge = /Edg/.test(navigator.userAgent);
        const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
        
        console.log('PWA Criteria Check:', {
          isMobile,
          isSecure,
          hasManifest: !!hasManifest,
          isChrome,
          isEdge,
          isSafari
        });
        
        // Always show installable prompt on mobile if basic criteria are met
        if (isMobile && isSecure && hasManifest) {
          console.log('PWA is installable on mobile device');
          setIsInstallable(true);
        }
      };

      // Delay to ensure DOM and manifest are fully loaded
      setTimeout(checkPWACriteria, 2000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const installApp = async () => {
    if (deferredPrompt) {
      try {
        console.log('Triggering PWA install prompt...');
        await deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the PWA install prompt');
          setIsInstallable(false);
          setDeferredPrompt(null);
          return true;
        } else {
          console.log('User dismissed the PWA install prompt');
        }
        return false;
      } catch (error) {
        console.error('Error during PWA installation:', error);
        return false;
      }
    }
    
    console.log('No deferred prompt available - showing manual instructions');
    return false;
  };

  return {
    isInstallable,
    isInstalled,
    isOnline,
    installApp,
    canInstallDirectly: !!deferredPrompt
  };
};
