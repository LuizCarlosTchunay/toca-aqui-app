
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  // Mostrar um indicador de carregamento enquanto verificamos a autenticação
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-toca-accent"></div>
      </div>
    );
  }

  // Redirecionar para login se não estiver autenticado
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Renderizar componente filho se estiver autenticado
  return <>{children}</>;
};

export default ProtectedRoute;
