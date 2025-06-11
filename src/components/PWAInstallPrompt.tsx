
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, X, Smartphone, Monitor } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';
import { useIsMobile } from '@/hooks/use-mobile';

const PWAInstallPrompt = () => {
  const { isInstallable, isInstalled, installApp } = usePWA();
  const [showPrompt, setShowPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const hasBeenDismissed = localStorage.getItem('pwa-install-dismissed');
    
    // No mobile, mostrar mais rapidamente e mesmo sem o evento beforeinstallprompt
    if (isMobile && !isInstalled && !hasBeenDismissed) {
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 1000); // 1 segundo no mobile
      return () => clearTimeout(timer);
    } else if (isInstallable && !isInstalled && !hasBeenDismissed) {
      // Desktop - aguardar o evento beforeinstallprompt
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isInstallable, isInstalled, isMobile]);

  const handleInstall = async () => {
    const success = await installApp();
    if (success) {
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setDismissed(true);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  // iOS Safari detection
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);

  // Mostrar prompt se:
  // 1. É mobile e não está instalado
  // 2. Ou se é instalável (desktop com beforeinstallprompt)
  const shouldShow = (isMobile && !isInstalled) || isInstallable;

  if (!showPrompt || isInstalled || dismissed || !shouldShow) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96">
      <Card className="bg-toca-card border-toca-accent shadow-lg animate-pulse">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <Download size={20} className="text-toca-accent" />
              {isMobile ? '📱 Instalar App' : 'Instalar Toca Aqui'}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="text-toca-text-secondary hover:text-white p-1"
            >
              <X size={16} />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-toca-text-secondary text-sm">
            🚀 {isMobile ? 'Adicione à sua tela inicial!' : 'Instale nosso app para uma experiência completa e acesso offline!'}
          </p>
          
          <div className="flex items-center gap-2 text-xs text-toca-text-secondary">
            <Smartphone size={14} />
            <span>{isMobile ? 'Acesso rápido e offline' : 'Funciona em qualquer dispositivo'}</span>
          </div>

          {isIOS && isSafari ? (
            <div className="space-y-2">
              <Button
                onClick={handleDismiss}
                className="w-full bg-toca-accent hover:bg-toca-accent-hover"
              >
                Entendi
              </Button>
              <div className="text-xs text-toca-text-secondary space-y-1 p-2 bg-toca-background rounded">
                <p className="font-semibold">Para instalar no iOS:</p>
                <p>1. Toque no ícone de compartilhar ↗️</p>
                <p>2. Selecione "Adicionar à Tela de Início"</p>
              </div>
            </div>
          ) : isAndroid ? (
            <div className="space-y-2">
              <Button
                onClick={handleInstall}
                className="w-full bg-toca-accent hover:bg-toca-accent-hover"
              >
                <Download size={16} className="mr-2" />
                Instalar App
              </Button>
              <div className="text-xs text-toca-text-secondary space-y-1 p-2 bg-toca-background rounded">
                <p className="font-semibold">No Android:</p>
                <p>• Toque em "Instalar App" acima</p>
                <p>• Ou use o menu do navegador → "Adicionar à tela inicial"</p>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button
                onClick={handleInstall}
                className="flex-1 bg-toca-accent hover:bg-toca-accent-hover"
              >
                <Download size={16} className="mr-2" />
                Instalar App
              </Button>
              <Button
                variant="outline"
                onClick={handleDismiss}
                className="border-toca-border text-toca-text-secondary"
              >
                Agora não
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PWAInstallPrompt;
