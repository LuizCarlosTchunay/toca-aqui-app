
import React from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';

const PWAOfflineIndicator = () => {
  const { isOnline } = usePWA();

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white py-2 px-4">
      <div className="flex items-center justify-center gap-2 text-sm">
        <WifiOff size={16} />
        <span>Você está offline. Algumas funcionalidades podem estar limitadas.</span>
      </div>
    </div>
  );
};

export default PWAOfflineIndicator;
