
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
      // Check for standalone mode (PWA installed)
      if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
        console.log('App is running in standalone mode (installed)');
        setIsInstalled(true);
        return true;
      }
      
      // Check for iOS Safari standalone
      if (window.navigator && (window.navigator as any).standalone) {
        console.log('App is running in iOS standalone mode (installed)');
        setIsInstalled(true);
        return true;
      }
      
      // Check if running from home screen on Android
      if (window.location.search.includes('utm_source=homescreen') || 
          document.referrer.includes('android-app://')) {
        console.log('App launched from home screen (installed)');
        setIsInstalled(true);
        return true;
      }
      
      return false;
    };

    const installed = checkInstalled();

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('beforeinstallprompt event fired - app is installable');
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      if (!installed) {
        setIsInstallable(true);
      }
    };

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      console.log('App was successfully installed');
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      
      // Show success message
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Toca Aqui instalado!', {
          body: 'O app foi adicionado à sua tela inicial. Toque no ícone para abrir.',
          icon: '/lovable-uploads/66d87de3-4ebd-4f4b-9d3f-c9bbb3e3c4ef.png'
        });
      }
    };

    // Listen for online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // For devices that don't support beforeinstallprompt, show install option anyway
    if (!installed && !deferredPrompt) {
      const timer = setTimeout(() => {
        if (!isInstalled && !deferredPrompt) {
          console.log('Setting installable to true for manual installation');
          setIsInstallable(true);
        }
      }, 2000);
      
      return () => {
        clearTimeout(timer);
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.removeEventListener('appinstalled', handleAppInstalled);
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const installApp = async () => {
    console.log('Install app clicked, deferredPrompt available:', !!deferredPrompt);
    
    if (deferredPrompt) {
      try {
        console.log('Showing native install prompt');
        await deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        
        console.log('User choice:', choiceResult.outcome);
        
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
          // Don't set states here, let the appinstalled event handle it
          return true;
        } else {
          console.log('User dismissed the install prompt');
          return false;
        }
      } catch (error) {
        console.error('Error during installation:', error);
        showManualInstructions();
        return false;
      }
    } else {
      console.log('No native prompt available, showing manual instructions');
      showManualInstructions();
      return false;
    }
  };

  const showManualInstructions = () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    
    let message = '';
    
    if (isIOS) {
      message = `Para instalar o Toca Aqui no seu iPhone/iPad:

1. Toque no ícone de compartilhar (↗️) na barra inferior
2. Role para baixo e toque em "Adicionar à Tela de Início"
3. Toque em "Adicionar" para confirmar

O ícone do Toca Aqui aparecerá na sua tela inicial junto com seus outros apps!`;
    } else if (isAndroid) {
      message = `Para instalar o Toca Aqui no seu Android:

1. Toque no menu do Chrome (⋮) no canto superior direito
2. Selecione "Adicionar à tela inicial" ou "Instalar app"
3. Toque em "Adicionar" para confirmar

O ícone do Toca Aqui aparecerá na sua tela inicial como um app nativo!`;
    } else {
      message = `Para instalar o Toca Aqui:

1. Clique no menu do seu navegador
2. Procure por "Instalar app", "Adicionar à tela inicial" ou ícone de instalação
3. Confirme a instalação

O Toca Aqui ficará disponível como um aplicativo independente!`;
    }
    
    alert(message);
  };

  return {
    isInstallable: !isInstalled && (isInstallable || true), // Always show button if not installed
    isInstalled,
    isOnline,
    installApp
  };
};
