
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User, Search, Bell, Settings, LogOut } from "lucide-react";
import Logo from "./Logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import UserAvatar from "./UserAvatar";
import { useAuth } from "@/hooks/useAuth";
import CartIcon from "@/components/CartIcon";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { 
  Sheet, 
  SheetTrigger, 
  SheetContent, 
  SheetHeader, 
  SheetTitle 
} from "@/components/ui/sheet";

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
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Logo className="h-8 w-8" />
            <span className="text-xl font-bold text-white">Toca</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/explorar" 
              className="text-toca-text-secondary hover:text-white transition-colors"
            >
              Explorar
            </Link>
            <Link 
              to="/eventos" 
              className="text-toca-text-secondary hover:text-white transition-colors"
            >
              Eventos
            </Link>
            <Link 
              to="/sobre" 
              className="text-toca-text-secondary hover:text-white transition-colors"
            >
              Sobre
            </Link>
            <Link 
              to="/contato" 
              className="text-toca-text-secondary hover:text-white transition-colors"
            >
              Contato
            </Link>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Cart Icon - only show when authenticated */}
                <CartIcon />
                
                {/* Notifications */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:text-toca-accent"
                  onClick={() => navigate('/notificacoes')}
                >
                  <Bell size={20} />
                </Button>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-white hover:text-toca-accent">
                      <UserAvatar />
                      <span className="ml-2 hidden sm:inline">Minha Conta</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-toca-card border-toca-border">
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="cursor-pointer text-white hover:text-toca-accent">
                        <User className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/meu-perfil" className="cursor-pointer text-white hover:text-toca-accent">
                        <Settings className="mr-2 h-4 w-4" />
                        Meu Perfil
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/configuracoes" className="cursor-pointer text-white hover:text-toca-accent">
                        <Settings className="mr-2 h-4 w-4" />
                        Configurações
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-toca-border" />
                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-white hover:text-toca-accent">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Link to="/login">
                <Button className="bg-toca-accent hover:bg-toca-accent-hover text-white">
                  Entrar
                </Button>
              </Link>
            )}

            {/* Mobile menu button */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="sm" className="text-white">
                  <Menu size={20} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-toca-background border-toca-border">
                <SheetHeader>
                  <SheetTitle className="text-white">Menu</SheetTitle>
                </SheetHeader>
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
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
