
import React from "react";
import ContractorDashboard from "./ContractorDashboard";
import ProfessionalDashboard from "./ProfessionalDashboard";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";

const Dashboard = () => {
  const { currentRole, setCurrentRole } = useAuth();
  
  const toggleRole = () => {
    setCurrentRole(currentRole === "contratante" ? "profissional" : "contratante");
  };

  return (
    <div className="min-h-screen flex flex-col bg-toca-background">
      <Navbar 
        isAuthenticated={true} 
        currentRole={currentRole}
        onRoleToggle={toggleRole}
      />
      
      <div className="flex-1">
        {currentRole === "contratante" ? (
          <ContractorDashboard />
        ) : (
          <ProfessionalDashboard />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
