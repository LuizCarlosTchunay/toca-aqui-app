
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User, Search, Bell } from "lucide-react";
import Logo from "./Logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import UserAvatar from "./UserAvatar";
import { useAuth } from "@/hooks/useAuth";

interface NavbarProps {
  isAuthenticated?: boolean;
  currentRole?: "contratante" | "profissional";
  onRoleToggle?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  isAuthenticated: propIsAuthenticated,
  currentRole: propCurrentRole,
  onRoleToggle: propOnRoleToggle,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut, currentRole: authCurrentRole, setCurrentRole } = useAuth();
  
  const isAuthenticated = propIsAuthenticated !== undefined ? propIsAuthenticated : !!user;
  const activeRole = propCurrentRole || authCurrentRole || "contratante";
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const handleRoleToggle = () => {
    if (propOnRoleToggle) {
      propOnRoleToggle();
    } else {
      setCurrentRole(activeRole === "contratante" ? "profissional" : "contratante");
    }
  };
  
  const handleSignOut = async () => {
    await signOut();
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-toca-background border-b border-toca-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Logo />
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-toca-text-secondary hover:text-white"
                  asChild
                >
                  <Link to="/dashboard">Dashboard</Link>
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-toca-text-secondary hover:text-white"
                  asChild
                >
                  <Link to="/explorar">Explorar</Link>
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-toca-text-secondary hover:text-white"
                  asChild
                >
                  <Link to="/eventos">Eventos</Link>
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRoleToggle}
                  className={cn(
                    "border-toca-accent text-toca-accent hover:bg-toca-accent hover:text-white"
                  )}
                >
                  {activeRole === "contratante" ? "Modo profissional" : "Modo contratante"}
                </Button>
                
                <Button variant="ghost" size="icon" className="text-toca-text-secondary">
                  <Search size={20} />
                </Button>
                
                <Button variant="ghost" size="icon" className="text-toca-text-secondary">
                  <Bell size={20} />
                </Button>
                
                <UserAvatar user={{ 
                  name: user?.user_metadata?.nome || "Usuário",
                  image: user?.user_metadata?.avatar_url
                }} />
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-toca-text-secondary hover:text-white"
                  asChild
                >
                  <Link to="/sobre">Sobre</Link>
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="border-toca-accent text-toca-accent hover:bg-toca-accent hover:text-white"
                  asChild
                >
                  <Link to="/login">Entrar</Link>
                </Button>
                
                <Button
                  className="bg-toca-accent hover:bg-toca-accent-hover text-white"
                  size="sm"
                  asChild
                >
                  <Link to="/cadastro">Cadastrar</Link>
                </Button>
              </>
            )}
          </div>

          <div className="flex md:hidden items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-toca-text-secondary hover:text-white hover:bg-toca-card focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-4 space-y-1 bg-toca-background border-b border-toca-border">
            {isAuthenticated ? (
              <>
                <div className="px-4 py-3 border-b border-toca-border">
                  <UserAvatar 
                    showName 
                    user={{ 
                      name: user?.user_metadata?.nome || "Usuário",
                      image: user?.user_metadata?.avatar_url
                    }} 
                  />
                  <div className="mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        handleRoleToggle();
                        setIsMenuOpen(false);
                      }}
                      className="w-full border-toca-accent text-toca-accent hover:bg-toca-accent hover:text-white"
                    >
                      {activeRole === "contratante" ? "Modo profissional" : "Modo contratante"}
                    </Button>
                  </div>
                </div>
                <Link
                  to="/dashboard"
                  className="block px-4 py-2 text-toca-text-secondary hover:bg-toca-card"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/explorar"
                  className="block px-4 py-2 text-toca-text-secondary hover:bg-toca-card"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Explorar
                </Link>
                <Link
                  to="/eventos"
                  className="block px-4 py-2 text-toca-text-secondary hover:bg-toca-card"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Eventos
                </Link>
                <Link
                  to="/perfil"
                  className="block px-4 py-2 text-toca-text-secondary hover:bg-toca-card"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Meu Perfil
                </Link>
                <Link
                  to="/notificacoes"
                  className="block px-4 py-2 text-toca-text-secondary hover:bg-toca-card"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Notificações
                </Link>
                <Link
                  to="/configuracoes"
                  className="block px-4 py-2 text-toca-text-secondary hover:bg-toca-card"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Configurações
                </Link>
                <button 
                  className="block w-full text-left px-4 py-2 text-toca-text-secondary hover:bg-toca-card"
                  onClick={handleSignOut}
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/sobre"
                  className="block px-4 py-2 text-toca-text-secondary hover:bg-toca-card"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sobre
                </Link>
                <Link
                  to="/login"
                  className="block px-4 py-2 text-toca-text-secondary hover:bg-toca-card"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Entrar
                </Link>
                <Link
                  to="/cadastro"
                  className="block px-4 py-3 bg-toca-accent text-white font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Cadastrar
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
