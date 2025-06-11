
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
      const isStandalone = window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;
      const isIOSStandalone = window.navigator && (window.navigator as any).standalone;
      const isAndroidStandalone = window.location.search.includes('utm_source=homescreen') || 
                                 document.referrer.includes('android-app://');
      
      const installed = isStandalone || isIOSStandalone || isAndroidStandalone;
      
      console.log('PWA Detection:', {
        isStandalone,
        isIOSStandalone,
        isAndroidStandalone,
        installed,
        userAgent: navigator.userAgent,
        displayMode: window.matchMedia('(display-mode: standalone)').matches ? 'standalone' : 'browser'
      });
      
      setIsInstalled(installed);
      return installed;
    };

    const installed = checkInstalled();

    if (installed) {
      setIsInstallable(false);
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('beforeinstallprompt event fired');
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      console.log('App was installed successfully');
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      
      // Mostrar mensagem de sucesso específica
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isAndroid = /Android/.test(navigator.userAgent);
      
      let successMessage = '🎉 Toca Aqui instalado com sucesso!\n\n';
      
      if (isIOS) {
        successMessage += '📱 O ícone do app foi adicionado à sua tela inicial do iPhone/iPad.\n\n🏠 Procure pelo ícone "Toca Aqui" na tela inicial ao lado dos outros aplicativos!';
      } else if (isAndroid) {
        successMessage += '📱 O ícone do app foi adicionado à sua tela inicial do Android.\n\n🏠 Procure pelo ícone "Toca Aqui" na tela inicial ou na gaveta de aplicativos!';
      } else {
        successMessage += '📱 O ícone do app foi adicionado à sua tela inicial.\n\n🏠 Procure pelo ícone "Toca Aqui" para acesso rápido!';
      }
      
      alert(successMessage);
    };

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
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isAndroid = /Android/.test(navigator.userAgent);
      
      if (isIOS) {
        alert('📱 Para instalar o Toca Aqui no iPhone/iPad:\n\n1. Toque no ícone de compartilhar (↗️) na parte inferior do Safari\n2. Role para baixo e selecione "Adicionar à Tela de Início"\n3. Toque em "Adicionar"\n\n🏠 O ícone do app aparecerá na sua tela inicial ao lado dos outros aplicativos instalados!');
      } else if (isAndroid) {
        alert('📱 Para instalar o Toca Aqui no Android:\n\n1. Toque no menu do Chrome (⋮) no canto superior direito\n2. Selecione "Adicionar à tela inicial" ou "Instalar app"\n3. Confirme a instalação\n\n🏠 O ícone do app aparecerá na sua tela inicial e na gaveta de aplicativos!');
      } else {
        alert('📱 Para instalar o Toca Aqui:\n\n1. Clique no menu do navegador\n2. Selecione "Instalar app" ou "Adicionar à tela inicial"\n3. Confirme a instalação\n\n🏠 O ícone do app aparecerá na sua tela inicial!');
      }
      return false;
    }

    try {
      console.log('Showing install prompt');
      
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isAndroid = /Android/.test(navigator.userAgent);
      
      let preMessage = '📱 Ao confirmar a instalação, o Toca Aqui será adicionado como um aplicativo na sua tela inicial.\n\n';
      
      if (isIOS) {
        preMessage += '🏠 iPhone/iPad: O ícone aparecerá na tela inicial ao lado dos outros apps instalados.\n\n';
      } else if (isAndroid) {
        preMessage += '🏠 Android: O ícone aparecerá na tela inicial e na gaveta de aplicativos.\n\n';
      } else {
        preMessage += '🏠 O ícone aparecerá na sua tela inicial para acesso rápido.\n\n';
      }
      
      preMessage += '✨ Você poderá acessar o app diretamente da tela inicial, como qualquer outro aplicativo!\n\nDeseja continuar com a instalação?';
      
      if (confirm(preMessage)) {
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
      }
      return false;
    } catch (error) {
      console.error('Error installing app:', error);
      alert("Erro ao instalar o app. Tente novamente ou use as instruções manuais do seu navegador.");
      return false;
    }
  };

  const shouldShowInstallButton = !isInstalled && (isInstallable || !deferredPrompt);

  return {
    isInstallable: shouldShowInstallButton,
    isInstalled,
    isOnline,
    installApp
  };
};
