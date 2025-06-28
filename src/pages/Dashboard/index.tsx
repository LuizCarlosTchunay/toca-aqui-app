
import React, { useState, useEffect } from "react";
import ContractorDashboard from "./ContractorDashboard";
import ProfessionalDashboard from "./ProfessionalDashboard";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

const Dashboard = () => {
  const { currentRole, setCurrentRole, loading: authLoading } = useAuth();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  // Set mounted state after component mounts
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);
  
  const toggleRole = () => {
    if (!isMounted) return;
    setIsTransitioning(true);
    setCurrentRole(currentRole === "contratante" ? "profissional" : "contratante");
  };

  // When role changes, add a short delay before stopping transition state
  useEffect(() => {
    if (isTransitioning && isMounted) {
      const timer = setTimeout(() => setIsTransitioning(false), 500);
      return () => clearTimeout(timer);
    }
  }, [currentRole, isTransitioning, isMounted]);

  // Show loading state if auth is loading or component is not mounted yet
  if (authLoading || !isMounted) {
    return (
      <div className="min-h-screen flex flex-col bg-toca-background">
        <Navbar isAuthenticated={true} />
        <div className="flex items-center justify-center flex-1">
          <Loader2 className="h-8 w-8 animate-spin text-toca-accent mr-2" />
          <span className="text-toca-text-primary">Carregando dashboard...</span>
        </div>
      </div>
    );
  }

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
            <Loader2 className="h-8 w-8 animate-spin text-toca-accent mr-2" />
            <span className="text-toca-text-primary">Carregando dashboard...</span>
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
