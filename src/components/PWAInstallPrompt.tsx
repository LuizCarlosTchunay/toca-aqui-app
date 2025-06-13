
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, X, Smartphone } from 'lucide-react';
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
      }, isMobile ? 2000 : 3000);
      return () => clearTimeout(timer);
    }
  }, [isInstallable, isInstalled, isMobile]);

  const handleInstall = async () => {
    if (canInstallDirectly) {
      const success = await installApp();
      if (success) {
        setShowPrompt(false);
      }
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

          {canInstallDirectly ? (
            <div className="space-y-2">
              <Button
                onClick={handleInstall}
                className="w-full bg-toca-accent hover:bg-toca-accent-hover text-white font-semibold"
              >
                <Download size={16} className="mr-2" />
                Instalar Agora
              </Button>
            </div>
          ) : isIOS && isSafari ? (
            <div className="space-y-2">
              <div className="text-xs text-toca-text-secondary space-y-1 p-3 bg-toca-background rounded border border-toca-border">
                <p className="font-semibold text-toca-accent">📱 Para instalar no Safari (iOS):</p>
                <p>1. Toque no ícone de compartilhar ↗️ (no centro inferior)</p>
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
          ) : isChrome && isAndroid ? (
            <div className="space-y-2">
              <div className="text-xs text-toca-text-secondary space-y-2 p-3 bg-toca-background rounded border border-toca-border">
                <p className="font-semibold text-toca-accent">📱 Como instalar no Chrome Android:</p>
                
                <div className="bg-toca-card p-2 rounded border-l-2 border-toca-accent">
                  <p className="font-medium text-white mb-1">🔥 MÉTODO 1 - Mais Fácil:</p>
                  <p>• Procure por um ícone de download (⬇️) na barra de endereços</p>
                  <p>• OU um banner "Instalar app" que pode aparecer na parte inferior</p>
                  <p>• Toque para instalar diretamente!</p>
                </div>

                <div className="bg-toca-card p-2 rounded border-l-2 border-yellow-500">
                  <p className="font-medium text-white mb-1">📱 MÉTODO 2 - Menu Chrome:</p>
                  <p>1. Toque nos 3 pontos (⋮) no canto superior direito</p>
                  <p>2. Procure por:</p>
                  <p className="ml-2">• "Instalar app" OU</p>
                  <p className="ml-2">• "Adicionar à tela inicial" OU</p>
                  <p className="ml-2">• "Adicionar ao Chrome"</p>
                  <p>3. Confirme a instalação</p>
                </div>

                <div className="bg-green-900/20 p-2 rounded border-l-2 border-green-500">
                  <p className="text-green-300 text-xs">💡 Se não encontrar essas opções, pode ser que seu Chrome precise ser atualizado na Play Store!</p>
                </div>
              </div>
              
              <Button
                onClick={handleDismiss}
                className="w-full bg-toca-accent hover:bg-toca-accent-hover"
              >
                Entendi, vou tentar!
              </Button>
            </div>
          ) : isEdge && isAndroid ? (
            <div className="space-y-2">
              <div className="text-xs text-toca-text-secondary space-y-1 p-3 bg-toca-background rounded border border-toca-border">
                <p className="font-semibold text-toca-accent">📱 Para instalar no Microsoft Edge:</p>
                <p>1. Toque nos 3 pontos (...) no menu inferior</p>
                <p>2. Procure por "Aplicativos" ou "Apps"</p>
                <p>3. Toque em "Instalar este site como aplicativo"</p>
                <p>4. Confirme tocando em "Instalar"</p>
              </div>
              <Button
                onClick={handleDismiss}
                className="w-full bg-toca-accent hover:bg-toca-accent-hover"
              >
                Entendi
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-xs text-toca-text-secondary space-y-1 p-3 bg-toca-background rounded border border-toca-border">
                <p className="font-semibold text-toca-accent">📱 Para instalar como app:</p>
                <p>• Procure por um ícone de download na barra de endereços</p>
                <p>• OU acesse o menu do seu navegador</p>
                <p>• Procure por opções como:</p>
                <p className="ml-2">- "Instalar app"</p>
                <p className="ml-2">- "Adicionar à tela inicial"</p>
                <p className="ml-2">- "Adicionar ao Chrome/Edge"</p>
                <p>• O app ficará disponível como ícone nativo!</p>
              </div>
              <Button
                onClick={handleDismiss}
                className="w-full bg-toca-accent hover:bg-toca-accent-hover"
              >
                Entendi
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PWAInstallPrompt;
