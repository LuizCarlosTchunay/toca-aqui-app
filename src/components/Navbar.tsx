import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { 
  Home, 
  Search, 
  Calendar, 
  User, 
  Bell, 
  Settings,
  LogOut 
} from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const { signOut } = useAuth();

  const navItems = [
    { href: '/dashboard', icon: Home, label: 'Dashboard' },
    { href: '/explore', icon: Search, label: 'Explorar' },
    { href: '/events', icon: Calendar, label: 'Eventos' },
    { href: '/profile', icon: User, label: 'Perfil' },
    { href: '/notifications', icon: Bell, label: 'Notificações' },
    { href: '/settings', icon: Settings, label: 'Configurações' },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-toca-card border-b border-toca-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-toca-text-primary">
              Toca<span className="text-toca-accent">Aqui</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.href}
                  asChild
                  variant={isActive(item.href) ? 'default' : 'ghost'}
                  size="sm"
                  className={
                    isActive(item.href)
                      ? 'bg-toca-accent text-white'
                      : 'text-toca-text-secondary hover:text-toca-accent hover:bg-toca-background'
                  }
                >
                  <Link to={item.href} className="flex items-center space-x-2">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                </Button>
              );
            })}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={signOut}
              className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              className="text-toca-text-secondary"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-toca-card border-t border-toca-border">
        <div className="grid grid-cols-5 h-16">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex flex-col items-center justify-center space-y-1 ${
                  isActive(item.href)
                    ? 'text-toca-accent'
                    : 'text-toca-text-secondary'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;