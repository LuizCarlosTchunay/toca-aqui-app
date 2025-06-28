
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bell, Menu, X, User, LogOut, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useNotifications } from "@/hooks/useNotifications";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Logo from "./Logo";

interface NavbarProps {
  isAuthenticated?: boolean;
  currentRole?: "contratante" | "profissional" | null;
}

const Navbar = ({ isAuthenticated = false, currentRole = null }: NavbarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  
  // Use the new notifications hook
  const { unreadCount } = useNotifications();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
      toast.success("Logout realizado com sucesso!");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      toast.error("Erro ao fazer logout");
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavClick = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-toca-card border-b border-toca-border sticky top-0 z-50 backdrop-blur-sm bg-toca-card/90">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Logo />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Button
              variant="ghost"
              className={`text-white hover:text-toca-accent transition-colors ${
                isActivePath("/") ? "text-toca-accent" : ""
              }`}
              onClick={() => handleNavClick("/")}
            >
              Início
            </Button>
            <Button
              variant="ghost"
              className={`text-white hover:text-toca-accent transition-colors ${
                isActivePath("/eventos") ? "text-toca-accent" : ""
              }`}
              onClick={() => handleNavClick("/eventos")}
            >
              Eventos
            </Button>
            <Button
              variant="ghost"
              className={`text-white hover:text-toca-accent transition-colors ${
                isActivePath("/profissionais") ? "text-toca-accent" : ""
              }`}
              onClick={() => handleNavClick("/profissionais")}
            >
              Profissionais
            </Button>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated && user ? (
              <>
                {/* Notifications - UPDATED with real-time count */}
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:text-toca-accent relative"
                    onClick={() => handleNavClick("/notifications")}
                  >
                    <Bell size={20} />
                    {unreadCount > 0 && (
                      <Badge 
                        className="absolute -top-2 -right-2 bg-toca-accent hover:bg-toca-accent min-w-5 h-5 flex items-center justify-center text-xs font-bold"
                      >
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </Badge>
                    )}
                  </Button>
                </div>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-white hover:text-toca-accent">
                      <User size={20} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-toca-card border-toca-border">
                    <DropdownMenuItem 
                      onClick={() => handleNavClick("/dashboard")}
                      className="text-white hover:bg-toca-background focus:bg-toca-background cursor-pointer"
                    >
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleNavClick("/meu-perfil")}
                      className="text-white hover:bg-toca-background focus:bg-toca-background cursor-pointer"
                    >
                      Meu Perfil
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleNavClick("/configuracoes")}
                      className="text-white hover:bg-toca-background focus:bg-toca-background cursor-pointer"
                    >
                      <Settings size={16} className="mr-2" />
                      Configurações
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-toca-border" />
                    <DropdownMenuItem 
                      onClick={handleLogout}
                      className="text-red-400 hover:bg-toca-background focus:bg-toca-background cursor-pointer"
                    >
                      <LogOut size={16} className="mr-2" />
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  className="text-white hover:text-toca-accent"
                  onClick={() => handleNavClick("/login")}
                >
                  Entrar
                </Button>
                <Button
                  className="bg-toca-accent hover:bg-toca-accent-hover text-white"
                  onClick={() => handleNavClick("/register")}
                >
                  Cadastrar
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMobileMenu}
                className="text-white hover:text-toca-accent"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Button
              variant="ghost"
              className={`w-full text-left justify-start text-white hover:text-toca-accent ${
                isActivePath("/") ? "text-toca-accent" : ""
              }`}
              onClick={() => handleNavClick("/")}
            >
              Início
            </Button>
            <Button
              variant="ghost"
              className={`w-full text-left justify-start text-white hover:text-toca-accent ${
                isActivePath("/eventos") ? "text-toca-accent" : ""
              }`}
              onClick={() => handleNavClick("/eventos")}
            >
              Eventos
            </Button>
            <Button
              variant="ghost"
              className={`w-full text-left justify-start text-white hover:text-toca-accent ${
                isActivePath("/profissionais") ? "text-toca-accent" : ""
              }`}
              onClick={() => handleNavClick("/profissionais")}
            >
              Profissionais
            </Button>
            
            {isAuthenticated && user && (
              <>
                <div className="border-t border-toca-border my-2"></div>
                <Button
                  variant="ghost"
                  className="w-full text-left justify-start text-white hover:text-toca-accent"
                  onClick={() => handleNavClick("/dashboard")}
                >
                  Dashboard
                </Button>
                <Button
                  variant="ghost"
                  className="w-full text-left justify-start text-white hover:text-toca-accent"
                  onClick={() => handleNavClick("/meu-perfil")}
                >
                  Meu Perfil
                </Button>
                <Button
                  variant="ghost"
                  className="w-full text-left justify-start text-white hover:text-toca-accent flex items-center"
                  onClick={() => handleNavClick("/notifications")}
                >
                  <Bell size={16} className="mr-2" />
                  Notificações
                  {unreadCount > 0 && (
                    <Badge className="ml-2 bg-toca-accent hover:bg-toca-accent">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </Badge>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  className="w-full text-left justify-start text-red-400 hover:text-red-300"
                  onClick={handleLogout}
                >
                  <LogOut size={16} className="mr-2" />
                  Sair
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
