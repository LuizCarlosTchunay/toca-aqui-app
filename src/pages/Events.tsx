import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const Events = () => {
  const { currentRole } = useAuth();
  const [activeTab, setActiveTab] = useState<'available' | 'my-events'>(
    currentRole === 'contratante' ? 'my-events' : 'available'
  );

  const events = [
    {
      id: '1',
      titulo: 'Casamento João e Maria',
      descricao: 'Cerimônia e festa de casamento para 150 convidados',
      data_evento: '2024-02-15',
      horario_inicio: '18:00',
      horario_fim: '02:00',
      local: 'Salão de Festas Elegance',
      cidade: 'São Paulo',
      estado: 'SP',
      orcamento: 15000,
      status: 'ativo',
      tipo_evento: 'Casamento',
    },
    {
      id: '2',
      titulo: 'Festa de Aniversário - 50 anos',
      descricao: 'Comemoração de aniversário com música ao vivo',
      data_evento: '2024-02-20',
      horario_inicio: '19:00',
      horario_fim: '01:00',
      local: 'Chácara Bela Vista',
      cidade: 'Campinas',
      estado: 'SP',
      orcamento: 8000,
      status: 'ativo',
      tipo_evento: 'Festa de Aniversário',
    },
    {
      id: '3',
      titulo: 'Evento Corporativo - Lançamento',
      descricao: 'Evento de lançamento de produto com coquetel',
      data_evento: '2024-02-25',
      horario_inicio: '18:30',
      horario_fim: '22:00',
      local: 'Hotel Copacabana Palace',
      cidade: 'Rio de Janeiro',
      estado: 'RJ',
      orcamento: 25000,
      status: 'ativo',
      tipo_evento: 'Evento Corporativo',
    },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo':
        return 'text-green-500';
      case 'cancelado':
        return 'text-red-500';
      case 'concluido':
        return 'text-gray-500';
      default:
        return 'text-toca-accent';
    }
  };

  return (
    <div className="min-h-screen bg-toca-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-toca-text-primary mb-4">Eventos</h1>
          
          {/* Tabs */}
          <div className="flex bg-toca-card rounded-lg p-1 border border-toca-border mb-4">
            <Button
              variant={activeTab === 'available' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('available')}
              className={`flex-1 ${
                activeTab === 'available'
                  ? 'bg-toca-accent text-white'
                  : 'text-toca-text-secondary'
              }`}
            >
              {currentRole === 'profissional' ? 'Disponíveis' : 'Explorar'}
            </Button>
            <Button
              variant={activeTab === 'my-events' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('my-events')}
              className={`flex-1 ${
                activeTab === 'my-events'
                  ? 'bg-toca-accent text-white'
                  : 'text-toca-text-secondary'
              }`}
            >
              {currentRole === 'contratante' ? 'Meus Eventos' : 'Candidaturas'}
            </Button>
          </div>
        </div>

        {/* Create Event Button */}
        {currentRole === 'contratante' && activeTab === 'my-events' && (
          <Button asChild className="bg-toca-accent hover:bg-toca-accent-hover">
            <Link to="/create-event">Criar Novo Evento</Link>
          </Button>
        )}

        {/* Events List */}
        <div className="space-y-4">
          {events.map((event) => (
            <Card key={event.id} className="p-6 bg-toca-card border-toca-border">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-toca-text-primary mb-2">
                    {event.titulo}
                  </h3>
                  <p className="text-toca-accent text-sm font-medium mb-2">
                    {event.tipo_evento}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(event.status)}`}>
                  {event.status}
                </span>
              </div>

              <p className="text-toca-text-secondary mb-4 line-clamp-2">
                {event.descricao}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-toca-text-secondary">📅 Data:</span>
                    <span className="text-toca-text-primary">{formatDate(event.data_evento)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-toca-text-secondary">⏰ Horário:</span>
                    <span className="text-toca-text-primary">
                      {event.horario_inicio} - {event.horario_fim}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-toca-text-secondary">📍 Local:</span>
                    <span className="text-toca-text-primary text-right">
                      {event.local}, {event.cidade}/{event.estado}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-toca-text-secondary">💰 Orçamento:</span>
                    <span className="text-toca-text-primary font-bold">
                      R$ {event.orcamento.toLocaleString('pt-BR')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                {currentRole === 'profissional' && activeTab === 'available' && (
                  <Button size="sm" className="bg-toca-accent hover:bg-toca-accent-hover">
                    Candidatar-se
                  </Button>
                )}
                {currentRole === 'contratante' && activeTab === 'my-events' && (
                  <Button variant="outline" size="sm" className="border-toca-accent text-toca-accent">
                    Ver Candidaturas
                  </Button>
                )}
                <Button variant="ghost" size="sm" className="text-toca-text-secondary">
                  Ver Detalhes
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {events.length === 0 && (
          <div className="text-center py-12">
            <p className="text-toca-text-secondary text-lg">
              {activeTab === 'available'
                ? 'Nenhum evento disponível no momento'
                : 'Você ainda não tem eventos'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;