
import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const [isTimeoutReached, setIsTimeoutReached] = useState(false);
  const location = useLocation();
  
  // Set a timeout to prevent indefinite loading
  useEffect(() => {
    // Only start the timeout if we're actually loading
    if (loading) {
      const timer = setTimeout(() => {
        setIsTimeoutReached(true);
      }, 3000); // 3 seconds timeout
      
      return () => clearTimeout(timer);
    }
    
    // Reset timeout state when loading changes to false
    if (!loading) {
      setIsTimeoutReached(false);
    }
  }, [loading]);

  // Show loading state while checking authentication
  if (loading && !isTimeoutReached) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-toca-background text-white">
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
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect to login if not authenticated
  if (!user) {
    console.log("User not authenticated, redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Render component if authenticated
  return <>{children}</>;
};

export default ProtectedRoute;
