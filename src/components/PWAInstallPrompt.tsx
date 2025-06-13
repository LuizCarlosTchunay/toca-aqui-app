
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, X, Smartphone, Monitor } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';
import { useIsMobile } from '@/hooks/use-mobile';

const PWAInstallPrompt = () => {
  const { isInstallable, isInstalled, installApp, canInstallDirectly } = usePWA();
  const [showPrompt, setShowPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const hasBeenDismissed = localStorage.getItem('pwa-install-dismissed');
    
    if (!isInstalled && !hasBeenDismissed && isInstallable) {
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, isMobile ? 1500 : 3000);
      return () => clearTimeout(timer);
    }
  }, [isInstallable, isInstalled, isMobile]);

  const handleInstall = async () => {
    if (canInstallDirectly) {
      const success = await installApp();
      if (success) {
        setShowPrompt(false);
      }
    } else {
      // Show manual instructions
      console.log('Showing manual install instructions');
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setDismissed(true);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  // Browser detection
  const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
  const isEdge = /Edg/.test(navigator.userAgent);
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);

  if (!showPrompt || isInstalled || dismissed || !isInstallable) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96">
      <Card className="bg-toca-card border-toca-accent shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <Download size={20} className="text-toca-accent" />
              📱 Instalar App
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
            🚀 Instale o Toca Aqui e tenha acesso rápido direto da sua tela inicial!
          </p>
          
          <div className="flex items-center gap-2 text-xs text-toca-text-secondary">
            <Smartphone size={14} />
            <span>Funciona offline • Notificações • Acesso rápido</span>
          </div>

          {isIOS && isSafari ? (
            <div className="space-y-2">
              <div className="text-xs text-toca-text-secondary space-y-1 p-3 bg-toca-background rounded border border-toca-border">
                <p className="font-semibold text-toca-accent">📱 Para instalar no iOS Safari:</p>
                <p>1. Toque no ícone de compartilhar ↗️</p>
                <p>2. Role para baixo e toque em "Adicionar à Tela de Início"</p>
                <p>3. Toque em "Adicionar" no canto superior direito</p>
              </div>
              <Button
                onClick={handleDismiss}
                className="w-full bg-toca-accent hover:bg-toca-accent-hover"
              >
                Entendi
              </Button>
            </div>
          ) : (isChrome || isEdge) && (isAndroid || isMobile) ? (
            <div className="space-y-2">
              <Button
                onClick={handleInstall}
                className="w-full bg-toca-accent hover:bg-toca-accent-hover text-white font-semibold"
              >
                <Download size={16} className="mr-2" />
                {canInstallDirectly ? 'Instalar Agora' : 'Como Instalar'}
              </Button>
              
              {!canInstallDirectly && (
                <div className="text-xs text-toca-text-secondary space-y-1 p-3 bg-toca-background rounded border border-toca-border">
                  <p className="font-semibold text-toca-accent">📱 Como instalar no {isChrome ? 'Chrome' : 'Edge'}:</p>
                  <p>1. Toque no menu (⋮) no canto superior direito</p>
                  <p>2. Selecione "Adicionar à tela inicial" ou "Instalar app"</p>
                  <p>3. Confirme tocando em "Adicionar" ou "Instalar"</p>
                  <p className="text-toca-accent">💡 O app aparecerá como ícone na sua tela inicial!</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <Button
                onClick={handleInstall}
                className="w-full bg-toca-accent hover:bg-toca-accent-hover"
              >
                <Download size={16} className="mr-2" />
                Instalar App
              </Button>
              <div className="text-xs text-toca-text-secondary space-y-1 p-3 bg-toca-background rounded border border-toca-border">
                <p className="font-semibold text-toca-accent">📱 Para instalar:</p>
                <p>• Use o menu do seu navegador</p>
                <p>• Procure por "Adicionar à tela inicial" ou "Instalar app"</p>
                <p>• O app ficará disponível como ícone nativo!</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PWAInstallPrompt;
