
import React from 'react';
import { usePWA } from '@/hooks/usePWA';

const PWAInstallPrompt = () => {
  const { isInstallable, isInstalled } = usePWA();

  // Não mostrar mais o popup automático
  return null;
};

export default PWAInstallPrompt;
