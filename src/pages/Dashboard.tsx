import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user, currentRole, setCurrentRole, signOut } = useAuth();

  const contractorActions = [
    { title: 'Criar Evento', href: '/create-event', icon: '🎉' },
    { title: 'Explorar Profissionais', href: '/explore', icon: '👥' },
    { title: 'Meus Eventos', href: '/events', icon: '📅' },
    { title: 'Reservas', href: '/reservations', icon: '📋' },
  ];

  const professionalActions = [
    { title: 'Editar Perfil', href: '/edit-profile', icon: '👤' },
    { title: 'Ver Eventos', href: '/events', icon: '🎪' },
    { title: 'Candidaturas', href: '/applications', icon: '📝' },
    { title: 'Agenda', href: '/schedule', icon: '📆' },
  ];

  const actions = currentRole === 'contratante' ? contractorActions : professionalActions;

  return (
    <div className="min-h-screen bg-toca-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-toca-text-primary">Dashboard</h1>
          
          {/* Role Toggle */}
          <div className="flex bg-toca-card rounded-lg p-1 border border-toca-border">
            <Button
              variant={currentRole === 'contratante' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setCurrentRole('contratante')}
              className={currentRole === 'contratante' ? 'bg-toca-accent text-white' : 'text-toca-text-secondary'}
            >
              Contratante
            </Button>
            <Button
              variant={currentRole === 'profissional' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setCurrentRole('profissional')}
              className={currentRole === 'profissional' ? 'bg-toca-accent text-white' : 'text-toca-text-secondary'}
            >
              Profissional
            </Button>
          </div>
        </div>

        {/* Welcome Card */}
        <Card className="p-6 bg-toca-card border-toca-border">
          <h2 className="text-xl font-bold text-toca-text-primary mb-2">
            Bem-vindo, {user?.user_metadata?.nome || 'Usuário'}!
          </h2>
          <p className="text-toca-text-secondary mb-1">{user?.email}</p>
          <p className="text-toca-text-secondary">
            Modo: <span className="text-toca-accent font-medium">
              {currentRole === 'contratante' ? 'Contratante' : 'Profissional'}
            </span>
          </p>
        </Card>

        {/* Quick Actions */}
        <div>
          <h3 className="text-xl font-bold text-toca-text-primary mb-4">Ações Rápidas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {actions.map((action, index) => (
              <Card key={index} className="p-6 bg-toca-card border-toca-border hover:border-toca-accent transition-colors">
                <Link to={action.href} className="block">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{action.icon}</span>
                    <span className="text-lg font-medium text-toca-text-primary">
                      {action.title}
                    </span>
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 bg-toca-card border-toca-border text-center">
            <div className="text-3xl font-bold text-toca-accent mb-2">12</div>
            <div className="text-toca-text-secondary">
              {currentRole === 'contratante' ? 'Eventos Criados' : 'Candidaturas'}
            </div>
          </Card>
          <Card className="p-6 bg-toca-card border-toca-border text-center">
            <div className="text-3xl font-bold text-toca-accent mb-2">5</div>
            <div className="text-toca-text-secondary">
              {currentRole === 'contratante' ? 'Profissionais Contratados' : 'Eventos Aceitos'}
            </div>
          </Card>
          <Card className="p-6 bg-toca-card border-toca-border text-center">
            <div className="text-3xl font-bold text-toca-accent mb-2">4.8</div>
            <div className="text-toca-text-secondary">Avaliação Média</div>
          </Card>
        </div>

        {/* Logout */}
        <div className="pt-6">
          <Button
            variant="outline"
            onClick={signOut}
            className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
          >
            Sair da Conta
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;