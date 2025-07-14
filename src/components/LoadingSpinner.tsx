import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-toca-background flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-toca-border border-t-toca-accent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-toca-text-secondary">Carregando...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;