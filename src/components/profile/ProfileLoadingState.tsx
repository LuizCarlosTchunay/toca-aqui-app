
import React from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";

interface ProfileLoadingStateProps {
  isAuthenticated: boolean;
}

const ProfileLoadingState: React.FC<ProfileLoadingStateProps> = ({ isAuthenticated }) => {
  return (
    <div className="min-h-screen flex flex-col bg-toca-background">
      <Navbar isAuthenticated={isAuthenticated} />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-toca-accent border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-center text-toca-text-secondary">Carregando perfil...</p>
      </div>
    </div>
  );
};

export default ProfileLoadingState;
