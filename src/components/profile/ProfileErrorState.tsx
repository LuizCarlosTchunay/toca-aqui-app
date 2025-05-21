
import React from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";

interface ProfileErrorStateProps {
  isAuthenticated: boolean;
  onRetry: () => void;
  onBack: () => void;
}

const ProfileErrorState: React.FC<ProfileErrorStateProps> = ({ 
  isAuthenticated, 
  onRetry, 
  onBack 
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-toca-background">
      <Navbar isAuthenticated={isAuthenticated} />
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-toca-text-secondary">Erro ao carregar perfil. Tente novamente mais tarde.</p>
        <Button 
          className="mx-auto mt-4 block bg-toca-accent hover:bg-toca-accent-hover"
          onClick={onRetry}
        >
          Tentar novamente
        </Button>
        <Button 
          className="mx-auto mt-4 block"
          variant="outline"
          onClick={onBack}
        >
          Voltar
        </Button>
      </div>
    </div>
  );
};

export default ProfileErrorState;
