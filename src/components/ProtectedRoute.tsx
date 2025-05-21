
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const [isTimeoutReached, setIsTimeoutReached] = useState(false);
  
  // Set a timeout to prevent indefinite loading
  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setIsTimeoutReached(true);
      }, 3000); // 3 seconds timeout
      
      return () => clearTimeout(timer);
    }
  }, [loading]);

  // Show loading state while checking authentication
  if (loading && !isTimeoutReached) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-toca-background">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-toca-accent mb-4"></div>
          <p className="text-toca-text-secondary">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // If timeout reached but still loading, redirect to login
  if (isTimeoutReached && loading) {
    console.log("Auth timeout reached, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Render component if authenticated
  return <>{children}</>;
};

export default ProtectedRoute;
