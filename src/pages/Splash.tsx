
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SplashPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/', { replace: true });
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-xxxl font-bold text-accent mb-md">Toca Aqui</h1>
        <p className="text-lg text-text-secondary">Conectando talentos do audiovisual</p>
        <div className="mt-xl">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-accent border-t-transparent mx-auto"></div>
        </div>
      </div>
    </div>
  );
};

export default SplashPage;
