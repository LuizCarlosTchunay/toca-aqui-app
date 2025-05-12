
import React from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Calendar, CheckCheck, UserCheck, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Notifications = () => {
  const navigate = useNavigate();
  
  // Mock notifications data
  const notifications = [
    {
      id: "1",
      type: "booking",
      title: "Nova reserva confirmada",
      message: "Sua reserva para o evento 'Casamento Silva' foi confirmada.",
      time: "há 2 horas",
      read: false,
      actionUrl: "/reservas/1"
    },
    {
      id: "2",
      type: "application",
      title: "Candidatura aprovada",
      message: "Sua candidatura para o evento 'Festival de Verão' foi aprovada.",
      time: "há 1 dia",
      read: true,
      actionUrl: "/eventos/1"
    },
    {
      id: "3",
      type: "payment",
      title: "Pagamento recebido",
      message: "Você recebeu um pagamento de R$1.500,00 referente ao evento 'Aniversário Empresarial'.",
      time: "há 2 dias",
      read: true,
      actionUrl: "/pagamentos/3"
    },
    {
      id: "4",
      type: "review",
      title: "Nova avaliação recebida",
      message: "Maria Oliveira deixou uma avaliação de 5 estrelas para você.",
      time: "há 3 dias",
      read: true,
      actionUrl: "/perfil-profissional"
    }
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "booking":
        return <Calendar className="text-toca-accent" size={20} />;
      case "application":
        return <CheckCheck className="text-green-500" size={20} />;
      case "payment":
        return <DollarSign className="text-yellow-500" size={20} />;
      case "review":
        return <UserCheck className="text-blue-500" size={20} />;
      default:
        return <Bell className="text-toca-accent" size={20} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-toca-background">
      <Navbar isAuthenticated={true} />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Notificações</h1>
        
        <Card className="bg-toca-card border-toca-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Suas Notificações</CardTitle>
            <Button variant="ghost" size="sm" className="text-toca-text-secondary">
              Marcar todas como lidas
            </Button>
          </CardHeader>
          <CardContent>
            {notifications.length > 0 ? (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`p-4 border ${notification.read ? 'border-toca-border' : 'border-toca-accent'} rounded-md flex`}
                  >
                    <div className="mr-4 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-white">{notification.title}</h3>
                        <div className="text-xs text-toca-text-secondary">{notification.time}</div>
                      </div>
                      
                      <p className="text-toca-text-secondary mb-3">{notification.message}</p>
                      
                      <div className="flex items-center">
                        <Button 
                          variant="link" 
                          className="text-toca-accent p-0 h-auto" 
                          onClick={() => navigate(notification.actionUrl)}
                        >
                          Ver detalhes
                        </Button>
                        
                        {!notification.read && (
                          <Badge className="ml-auto bg-toca-accent border-toca-accent">Nova</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <Bell size={48} className="text-toca-text-secondary mx-auto mb-4" />
                <p className="text-toca-text-secondary">Você não tem notificações novas.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Notifications;
