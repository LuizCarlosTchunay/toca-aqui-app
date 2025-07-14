import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Notifications = () => {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const notifications = [
    {
      id: '1',
      titulo: 'Nova candidatura recebida',
      mensagem: 'João Silva se candidatou para seu evento "Casamento Marina & Pedro"',
      tipo: 'candidatura',
      lida: false,
      created_at: '2024-01-15T10:30:00Z',
    },
    {
      id: '2',
      titulo: 'Evento aprovado',
      mensagem: 'Sua candidatura para "Festa de Aniversário - 50 anos" foi aceita!',
      tipo: 'evento',
      lida: false,
      created_at: '2024-01-14T15:45:00Z',
    },
    {
      id: '3',
      titulo: 'Pagamento recebido',
      mensagem: 'Você recebeu R$ 800,00 pelo evento "Show no Bar do Rock"',
      tipo: 'pagamento',
      lida: true,
      created_at: '2024-01-13T09:15:00Z',
    },
    {
      id: '4',
      titulo: 'Nova mensagem',
      mensagem: 'Maria Santos enviou uma mensagem sobre o evento corporativo',
      tipo: 'mensagem',
      lida: true,
      created_at: '2024-01-12T14:20:00Z',
    },
    {
      id: '5',
      titulo: 'Avaliação recebida',
      mensagem: 'Você recebeu uma avaliação de 5 estrelas! ⭐⭐⭐⭐⭐',
      tipo: 'avaliacao',
      lida: true,
      created_at: '2024-01-11T16:30:00Z',
    },
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'candidatura':
        return '👤';
      case 'evento':
        return '🎉';
      case 'pagamento':
        return '💰';
      case 'mensagem':
        return '💬';
      case 'avaliacao':
        return '⭐';
      default:
        return '🔔';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Agora há pouco';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h atrás`;
    } else if (diffInHours < 48) {
      return 'Ontem';
    } else {
      return date.toLocaleDateString('pt-BR');
    }
  };

  const filteredNotifications = notifications.filter(notif =>
    filter === 'all' ? true : !notif.lida
  );

  const unreadCount = notifications.filter(notif => !notif.lida).length;

  return (
    <div className="min-h-screen bg-toca-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-toca-text-primary mb-4">Notificações</h1>
          
          <div className="flex justify-between items-center mb-4">
            {unreadCount > 0 && (
              <div className="bg-toca-accent px-3 py-1 rounded-full">
                <span className="text-white text-sm font-bold">
                  {unreadCount} não lidas
                </span>
              </div>
            )}
            
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-toca-text-secondary hover:text-toca-accent"
              >
                Marcar todas como lidas
              </Button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex bg-toca-card rounded-lg p-1 border border-toca-border">
            <Button
              variant={filter === 'all' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter('all')}
              className={`flex-1 ${
                filter === 'all'
                  ? 'bg-toca-accent text-white'
                  : 'text-toca-text-secondary'
              }`}
            >
              Todas
            </Button>
            <Button
              variant={filter === 'unread' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter('unread')}
              className={`flex-1 ${
                filter === 'unread'
                  ? 'bg-toca-accent text-white'
                  : 'text-toca-text-secondary'
              }`}
            >
              Não lidas
            </Button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <Card
              key={notification.id}
              className={`p-4 bg-toca-card border-toca-border ${
                !notification.lida ? 'border-l-4 border-l-toca-accent' : ''
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-toca-background rounded-full flex items-center justify-center">
                  <span className="text-lg">
                    {getNotificationIcon(notification.tipo)}
                  </span>
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-toca-text-primary">
                      {notification.titulo}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-toca-text-secondary">
                        {formatDate(notification.created_at)}
                      </span>
                      {!notification.lida && (
                        <div className="w-2 h-2 bg-toca-accent rounded-full"></div>
                      )}
                    </div>
                  </div>
                  <p className="text-toca-text-secondary text-sm">
                    {notification.mensagem}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredNotifications.length === 0 && (
          <div className="text-center py-12">
            <p className="text-toca-text-secondary text-lg">
              {filter === 'all'
                ? 'Você não tem notificações'
                : 'Todas as notificações foram lidas'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;