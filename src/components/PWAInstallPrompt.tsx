import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { usePWAContext } from '@/contexts/PWAContext';
import { X, Download } from 'lucide-react';

const PWAInstallPrompt = () => {
  const [isVisible, setIsVisible] = useState(true);
  const { installApp, canInstallDirectly } = usePWAContext();

  const handleInstall = async () => {
    const success = await installApp();
    if (success || !canInstallDirectly) {
      setIsVisible(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    // Store dismissal in localStorage to not show again for a while
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-80">
      <Card className="p-4 bg-toca-card border-toca-border shadow-lg">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Download className="w-5 h-5 text-toca-accent" />
            <h3 className="font-bold text-toca-text-primary">Instalar App</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="text-toca-text-secondary hover:text-toca-accent p-1"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <p className="text-sm text-toca-text-secondary mb-4">
          Instale o Toca Aqui no seu dispositivo para uma experiência melhor e acesso offline.
        </p>
        
        <div className="flex space-x-2">
          <Button
            onClick={handleInstall}
            size="sm"
            className="flex-1 bg-toca-accent hover:bg-toca-accent-hover text-white"
          >
            Instalar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDismiss}
            className="border-toca-border text-toca-text-secondary"
          >
            Agora não
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default PWAInstallPrompt;