
import React, { useEffect, useState } from "react";
import Logo from "./Logo";

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
      setTimeout(onComplete, 500); // Allow the fade out animation to complete
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 bg-toca-background flex flex-col items-center justify-center transition-opacity duration-500 z-50 ${
        showSplash ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="flex flex-col items-center">
        <Logo size="lg" withText={false} className="mb-6 animate-neon-pulse" />
        <h1 className="text-3xl font-bold mb-2">
          <span className="text-white">Toca</span>
          <span className="text-toca-accent">Aqui</span>
        </h1>
        <p className="text-toca-text-secondary text-sm">
          Conectando talentos audiovisuais
        </p>
      </div>
      <div className="mt-12">
        <div className="w-16 h-1 bg-toca-accent rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};

export default SplashScreen;
