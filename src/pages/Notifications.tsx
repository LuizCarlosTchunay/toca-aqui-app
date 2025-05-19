
import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Calendar, CheckCheck, UserCheck, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/use-toast";
import { Spinner } from "@/components/Spinner";
import { AlertCircle } from "lucide-react";

// Type definition for a notification
type Notification = {
  id: string;
  type: "booking" | "application" | "payment" | "review" | "system";
  title: string;
  message: string;
  time: string;
  read: boolean;
  actionUrl: string;
  created_at: string;
};

const Notifications = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch notifications from Supabase
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        
        // Try to get real notifications from the database
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          setNotifications(data.map(notification => ({
            id: notification.id,
            type: notification.type || "system",
            title: notification.title,
            message: notification.message,
            time: formatTimeAgo(notification.created_at),
            read: notification.read,
            actionUrl: notification.action_url || "#",
            created_at: notification.created_at
          })));
        } else {
          // If no notifications found, use mock data
          setNotifications([
            {
              id: "1",
              type: "booking",
              title: "Nova reserva confirmada",
              message: "Sua reserva para o evento 'Casamento Silva' foi confirmada.",
              time: "há 2 horas",
              read: false,
              actionUrl: "/reservas/1",
              created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
            },
            {
              id: "2",
              type: "application",
              title: "Candidatura aprovada",
              message: "Sua candidatura para o evento 'Festival de Verão' foi aprovada.",
              time: "há 1 dia",
              read: true,
              actionUrl: "/eventos/1",
              created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
            },
            {
              id: "3",
              type: "payment",
              title: "Pagamento recebido",
              message: "Você recebeu um pagamento de R$1.500,00 referente ao evento 'Aniversário Empresarial'.",
              time: "há 2 dias",
              read: true,
              actionUrl: "/pagamentos/3",
              created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
              id: "4",
              type: "review",
              title: "Nova avaliação recebida",
              message: "Maria Oliveira deixou uma avaliação de 5 estrelas para você.",
              time: "há 3 dias",
              read: true,
              actionUrl: "/perfil-profissional",
              created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
            }
          ]);
        }
      } catch (err) {
        console.error("Erro ao buscar notificações:", err);
        setError("Não foi possível carregar suas notificações.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNotifications();
  }, [user]);
  
  // Format relative time (e.g. "2 hours ago")
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);
    
    if (diffMins < 60) {
      return `há ${diffMins} ${diffMins === 1 ? 'minuto' : 'minutos'}`;
    } else if (diffHours < 24) {
      return `há ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;
    } else {
      return `há ${diffDays} ${diffDays === 1 ? 'dia' : 'dias'}`;
    }
  };
  
  // Mark a notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      if (!user) return;
      
      const updatedNotifications = notifications.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true } 
          : notification
      );
      
      setNotifications(updatedNotifications);
      
      // Update in database if real data
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)
        .eq('user_id', user.id);
        
      if (error) throw error;
      
    } catch (err) {
      console.error("Erro ao marcar notificação como lida:", err);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a notificação.",
        variant: "destructive"
      });
    }
  };
  
  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      if (!user) return;
      
      const updatedNotifications = notifications.map(notification => ({
        ...notification,
        read: true
      }));
      
      setNotifications(updatedNotifications);
      
      // Update in database if real data
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .is('read', false);
        
      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Todas as notificações foram marcadas como lidas.",
      });
      
    } catch (err) {
      console.error("Erro ao marcar todas notificações como lidas:", err);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar as notificações.",
        variant: "destructive"
      });
    }
  };
  
  // Handle notification click
  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    navigate(notification.actionUrl);
  };

  // Get icon based on notification type
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
      <Navbar isAuthenticated={!!user} />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Notificações</h1>
        
        <Card className="bg-toca-card border-toca-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Suas Notificações</CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-toca-text-secondary"
              onClick={markAllAsRead}
              disabled={isLoading || notifications.every(n => n.read)}
            >
              Marcar todas como lidas
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-10">
                <Spinner size="lg" />
              </div>
            ) : error ? (
              <div className="text-center py-10">
                <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
                <p className="text-toca-text-secondary">{error}</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => window.location.reload()}
                >
                  Tentar novamente
                </Button>
              </div>
            ) : notifications.length > 0 ? (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`p-4 border ${notification.read ? 'border-toca-border' : 'border-toca-accent'} rounded-md flex cursor-pointer hover:bg-toca-background/30 transition-colors`}
                    onClick={() => handleNotificationClick(notification)}
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
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNotificationClick(notification);
                          }}
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
