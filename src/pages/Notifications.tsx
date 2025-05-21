
import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";
import NotificationItem from "@/components/NotificationItem";
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
        console.log("Fetched notifications:", fetchedNotifications);
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
        toast.error("Não foi possível atualizar a notificação.");
      }
    } catch (err) {
      console.error("Erro ao marcar notificação como lida:", err);
      toast.error("Não foi possível atualizar a notificação.");
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
        
        toast.success("Todas as notificações foram marcadas como lidas.");
      } else {
        toast.error("Não foi possível atualizar as notificações.");
      }
    } catch (err) {
      console.error("Erro ao marcar todas notificações como lidas:", err);
      toast.error("Não foi possível atualizar as notificações.");
    }
  };
  
  // Handle notification click
  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      handleMarkAsRead(notification.id);
    }
    
    // Navigate to the target page
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
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
                <div className="w-8 h-8 border-2 border-toca-accent border-t-transparent rounded-full animate-spin"></div>
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
                  <NotificationItem 
                    key={notification.id}
                    notification={notification}
                    onClick={handleNotificationClick}
                  />
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
