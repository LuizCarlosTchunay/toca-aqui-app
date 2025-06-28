
import React, { useState, useEffect } from "react";
import ContractorDashboard from "./ContractorDashboard";
import ProfessionalDashboard from "./ProfessionalDashboard";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

const Dashboard = () => {
  const { currentRole, setCurrentRole, loading: authLoading, user } = useAuth();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  // Debug logs
  console.log('Dashboard - authLoading:', authLoading);
  console.log('Dashboard - user:', user);
  console.log('Dashboard - currentRole:', currentRole);
  console.log('Dashboard - isMounted:', isMounted);
  
  // Set mounted state after component mounts
  useEffect(() => {
    console.log('Dashboard - mounting');
    setIsMounted(true);
    return () => {
      console.log('Dashboard - unmounting');
      setIsMounted(false);
    };
  }, []);
  
  const toggleRole = () => {
    if (!isMounted) {
      console.log('Dashboard - not mounted, skipping role toggle');
      return;
    }
    console.log('Dashboard - toggling role from:', currentRole);
    setIsTransitioning(true);
    setCurrentRole(currentRole === "contratante" ? "profissional" : "contratante");
  };

  // When role changes, add a short delay before stopping transition state
  useEffect(() => {
    if (isTransitioning && isMounted) {
      console.log('Dashboard - role transition in progress');
      const timer = setTimeout(() => {
        console.log('Dashboard - role transition complete');
        setIsTransitioning(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentRole, isTransitioning, isMounted]);

  // Show loading state if auth is loading or component is not mounted yet
  if (authLoading || !isMounted) {
    console.log('Dashboard - showing loading state');
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

  // Check if user is authenticated
  if (!user) {
    console.log('Dashboard - no user found, should redirect to login');
    return (
      <div className="min-h-screen flex flex-col bg-toca-background">
        <Navbar isAuthenticated={false} />
        <div className="flex items-center justify-center flex-1">
          <div className="text-center">
            <p className="text-toca-text-primary mb-4">Usuário não autenticado</p>
            <button 
              onClick={() => window.location.href = '/login'}
              className="bg-toca-accent text-white px-4 py-2 rounded hover:bg-toca-accent-hover"
            >
              Fazer Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  console.log('Dashboard - rendering main content');
  return (
    <div className="min-h-screen flex flex-col bg-toca-background">
      <Navbar 
        isAuthenticated={true} 
        currentRole={currentRole}
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
