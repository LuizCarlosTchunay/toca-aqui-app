
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
    // Check if app is already installed/running as PWA
    const checkInstalled = () => {
      // Check for standalone mode (PWA is installed and running)
      const isStandalone = window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;
      
      // Check for iOS standalone mode
      const isIOSStandalone = window.navigator && (window.navigator as any).standalone;
      
      // Check if running from home screen on Android
      const isAndroidStandalone = window.location.search.includes('utm_source=homescreen') || 
                                 document.referrer.includes('android-app://');
      
      const installed = isStandalone || isIOSStandalone || isAndroidStandalone;
      
      console.log('PWA Detection:', {
        isStandalone,
        isIOSStandalone,
        isAndroidStandalone,
        installed,
        userAgent: navigator.userAgent
      });
      
      setIsInstalled(installed);
      return installed;
    };

    const installed = checkInstalled();

    // Se já está instalado, não mostrar opções de instalação
    if (installed) {
      setIsInstallable(false);
      return;
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('beforeinstallprompt event fired');
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      console.log('App was installed');
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    // Listen for online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const installApp = async () => {
    console.log('Install app clicked, deferredPrompt:', deferredPrompt);
    
    if (!deferredPrompt) {
      console.log('No deferred prompt available - showing manual instructions');
      // Para dispositivos que não suportam o evento, mostrar instruções
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isAndroid = /Android/.test(navigator.userAgent);
      
      if (isIOS) {
        alert('Para instalar no iOS:\n1. Toque no ícone de compartilhar (↗️)\n2. Selecione "Adicionar à Tela de Início"');
      } else if (isAndroid) {
        alert('Para instalar:\n1. Toque no menu do Chrome (⋮)\n2. Selecione "Adicionar à tela inicial" ou "Instalar app"');
      } else {
        alert('Para instalar:\n1. Clique no menu do navegador\n2. Selecione "Instalar app" ou "Adicionar à tela inicial"');
      }
      return false;
    }

    try {
      console.log('Showing install prompt');
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      
      console.log('User choice:', choiceResult.outcome);
      
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
        setIsInstallable(false);
        setDeferredPrompt(null);
        return true;
      } else {
        console.log('User dismissed the install prompt');
      }
      return false;
    } catch (error) {
      console.error('Error installing app:', error);
      return false;
    }
  };

  // Só mostrar botão de instalação se não estiver instalado
  const shouldShowInstallButton = !isInstalled;

  return {
    isInstallable: shouldShowInstallButton,
    isInstalled,
    isOnline,
    installApp
  };
};
