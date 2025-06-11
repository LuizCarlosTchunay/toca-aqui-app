
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
      
      // Mostrar mensagem de sucesso sobre o ícone
      alert('✅ Toca Aqui instalado com sucesso!\n\n🏠 O ícone do app foi adicionado à sua tela inicial ao lado dos outros aplicativos.\n\n📱 Agora você pode acessar o app diretamente da tela inicial!');
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
      // Para dispositivos que não suportam o evento, mostrar instruções específicas
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isAndroid = /Android/.test(navigator.userAgent);
      
      if (isIOS) {
        alert('📱 Para instalar o Toca Aqui no iPhone/iPad:\n\n1. Toque no ícone de compartilhar (↗️) na parte inferior\n2. Role para baixo e selecione "Adicionar à Tela de Início"\n3. Toque em "Adicionar"\n\n🏠 O ícone do app aparecerá na sua tela inicial!');
      } else if (isAndroid) {
        alert('📱 Para instalar o Toca Aqui no Android:\n\n1. Toque no menu do Chrome (⋮) no canto superior\n2. Selecione "Adicionar à tela inicial" ou "Instalar app"\n3. Confirme a instalação\n\n🏠 O ícone do app aparecerá na sua tela inicial!');
      } else {
        alert('📱 Para instalar o Toca Aqui:\n\n1. Clique no menu do navegador\n2. Selecione "Instalar app" ou "Adicionar à tela inicial"\n3. Confirme a instalação\n\n🏠 O ícone do app aparecerá na sua tela inicial!');
      }
      return false;
    }

    try {
      console.log('Showing install prompt');
      
      // Mostrar mensagem prévia sobre o que vai acontecer
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isAndroid = /Android/.test(navigator.userAgent);
      
      let preMessage = '📱 Ao clicar em "Instalar" ou "Adicionar", o Toca Aqui será adicionado à sua tela inicial como um aplicativo.\n\n';
      
      if (isIOS) {
        preMessage += '🏠 No iPhone/iPad: O ícone aparecerá na tela inicial ao lado dos outros apps.';
      } else if (isAndroid) {
        preMessage += '🏠 No Android: O ícone aparecerá na tela inicial e na gaveta de aplicativos.';
      } else {
        preMessage += '🏠 O ícone aparecerá na sua tela inicial para acesso rápido.';
      }
      
      if (confirm(preMessage + '\n\nDeseja continuar com a instalação?')) {
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
