
import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Calendar, CheckCheck, UserCheck, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/use-toast";
import { Spinner } from "@/components/Spinner";
import { AlertCircle } from "lucide-react";
import { 
  Notification, 
  fetchRealNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead 
} from "@/utils/notifications";

const Notifications = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch notifications
  useEffect(() => {
    const getNotifications = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        
        // Fetch real notifications from Supabase
        const fetchedNotifications = await fetchRealNotifications(user.id);
        setNotifications(fetchedNotifications);
        
      } catch (err) {
        console.error("Erro ao buscar notificações:", err);
        setError("Não foi possível carregar suas notificações.");
      } finally {
        setIsLoading(false);
      }
    };
    
    getNotifications();
  }, [user]);
  
  // Mark a notification as read
  const handleMarkAsRead = async (notificationId: string) => {
    try {
      if (!user) return;
      
      const success = await markNotificationAsRead(notificationId, user.id);
      
      if (success) {
        // Update local state
        const updatedNotifications = notifications.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true } 
            : notification
        );
        
        setNotifications(updatedNotifications);
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível atualizar a notificação.",
          variant: "destructive"
        });
      }
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
  const handleMarkAllAsRead = async () => {
    try {
      if (!user) return;
      
      const success = await markAllNotificationsAsRead(user.id);
      
      if (success) {
        // Update local state
        const updatedNotifications = notifications.map(notification => ({
          ...notification,
          read: true
        }));
        
        setNotifications(updatedNotifications);
        
        toast({
          title: "Sucesso",
          description: "Todas as notificações foram marcadas como lidas.",
        });
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível atualizar as notificações.",
          variant: "destructive"
        });
      }
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
      handleMarkAsRead(notification.id);
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
              onClick={handleMarkAllAsRead}
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
