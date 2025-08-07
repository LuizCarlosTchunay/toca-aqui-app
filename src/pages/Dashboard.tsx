
import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';

const DashboardPage = () => {
  const { user, currentRole, setCurrentRole, signOut } = useAuth();

  const contractorActions = [
    { title: 'Criar Evento', path: '/create-event' },
    { title: 'Explorar Profissionais', path: '/explore' },
    { title: 'Meus Eventos', path: '/events' },
    { title: 'Notificações', path: '/notifications' },
  ];

  const professionalActions = [
    { title: 'Editar Perfil', path: '/edit-profile' },
    { title: 'Ver Eventos', path: '/events' },
    { title: 'Meu Perfil', path: '/profile' },
    { title: 'Notificações', path: '/notifications' },
  ];

  const actions = currentRole === 'contratante' ? contractorActions : professionalActions;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="p-lg border-b border-border">
        <div className="flex justify-between items-center">
          <h1 className="text-xxl font-bold text-text-primary">Dashboard</h1>
          <div className="flex items-center gap-md">
            {/* Role Toggle */}
            <div className="flex bg-card rounded-lg p-1">
              <Button
                title="Contratante"
                onPress={() => setCurrentRole('contratante')}
                variant={currentRole === 'contratante' ? 'primary' : 'ghost'}
                size="sm"
              />
              <Button
                title="Profissional"
                onPress={() => setCurrentRole('profissional')}
                variant={currentRole === 'profissional' ? 'primary' : 'ghost'}
                size="sm"
              />
            </div>
            <Link to="/settings">
              <Button variant="outline" size="sm" title="Configurações" />
            </Link>
          </div>
        </div>
      </header>

      <div className="p-lg max-w-6xl mx-auto">
        {/* Welcome Card */}
        <Card className="mb-xl">
          <h2 className="text-lg font-bold text-text-primary mb-sm">
            Bem-vindo, {user?.user_metadata?.nome || 'Usuário'}!
          </h2>
          <p className="text-text-secondary mb-xs">{user?.email}</p>
          <p className="text-text-secondary">
            Modo: {currentRole === 'contratante' ? 'Contratante' : 'Profissional'}
          </p>
        </Card>

        {/* Quick Actions */}
        <div className="mb-xl">
          <h3 className="text-lg font-bold text-text-primary mb-md">Ações Rápidas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md">
            {actions.map((action, index) => (
              <Link key={index} to={action.path}>
                <Card className="hover:bg-card/80 transition-colors cursor-pointer h-full">
                  <div className="text-center">
                    <h4 className="font-medium text-text-primary">{action.title}</h4>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mb-xl">
          <h3 className="text-lg font-bold text-text-primary mb-md">Atividade Recente</h3>
          <Card>
            <p className="text-text-secondary text-center py-xl">
              Nenhuma atividade recente para mostrar.
            </p>
          </Card>
        </div>

        {/* Sign Out */}
        <div className="text-center">
          <Button 
            title="Sair da Conta" 
            onPress={signOut}
            variant="outline"
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
