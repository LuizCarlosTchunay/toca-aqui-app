
import React, { useState, useEffect } from "react";
import ContractorDashboard from "./ContractorDashboard";
import ProfessionalDashboard from "./ProfessionalDashboard";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

const Dashboard = () => {
  const { currentRole, setCurrentRole } = useAuth();
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const toggleRole = () => {
    setIsTransitioning(true);
    setCurrentRole(currentRole === "contratante" ? "profissional" : "contratante");
  };

  // When role changes, add a short delay before stopping transition state
  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => setIsTransitioning(false), 300);
      return () => clearTimeout(timer);
    }
  }, [currentRole, isTransitioning]);

  return (
    <div className="min-h-screen flex flex-col bg-toca-background">
      <Navbar 
        isAuthenticated={true} 
        currentRole={currentRole}
        onRoleToggle={toggleRole}
      />
      
      <div className="flex-1">
        {isTransitioning ? (
          <div className="flex items-center justify-center h-full py-24">
            <Loader2 className="h-8 w-8 animate-spin text-toca-accent" />
            <span className="ml-2 text-toca-text-primary">Carregando dashboard...</span>
          </div>
        ) : currentRole === "contratante" ? (
          <ContractorDashboard />
        ) : (
          <ProfessionalDashboard />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
