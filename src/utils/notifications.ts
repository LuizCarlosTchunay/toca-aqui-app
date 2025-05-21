
import { supabase } from "@/integrations/supabase/client";

// Type definition for a notification
export type Notification = {
  id: string;
  type: "booking" | "application" | "payment" | "review" | "system";
  title: string;
  message: string;
  time: string;
  read: boolean;
  actionUrl: string;
  created_at: string;
  user_id: string;
};

// Generate mock notifications for development
export const getMockNotifications = (userId: string): Notification[] => {
  return [
    {
      id: "1",
      type: "booking",
      title: "Nova reserva confirmada",
      message: "Sua reserva para o evento 'Casamento Silva' foi confirmada.",
      time: "há 2 horas",
      read: false,
      actionUrl: "/reservas/1",
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      user_id: userId
    },
    {
      id: "2",
      type: "application",
      title: "Candidatura aprovada",
      message: "Sua candidatura para o evento 'Festival de Verão' foi aprovada.",
      time: "há 1 dia",
      read: true,
      actionUrl: "/eventos/1",
      created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      user_id: userId
    },
    {
      id: "3",
      type: "payment",
      title: "Pagamento recebido",
      message: "Você recebeu um pagamento de R$1.500,00 referente ao evento 'Aniversário Empresarial'.",
      time: "há 2 dias",
      read: true,
      actionUrl: "/pagamentos/3",
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      user_id: userId
    },
    {
      id: "4",
      type: "review",
      title: "Nova avaliação recebida",
      message: "Maria Oliveira deixou uma avaliação de 5 estrelas para você.",
      time: "há 3 dias",
      read: true,
      actionUrl: "/perfil-profissional",
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      user_id: userId
    }
  ];
};

// Format relative time (e.g. "2 hours ago")
export const formatTimeAgo = (dateString: string) => {
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
  } else if (diffDays < 30) {
    return `há ${diffDays} ${diffDays === 1 ? 'dia' : 'dias'}`;
  } else {
    // For older notifications, show the date
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
};

// Fetch real notifications from the Supabase database
export const fetchRealNotifications = async (userId: string): Promise<Notification[]> => {
  try {
    console.log("Fetching notifications for user:", userId);
    
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Erro ao buscar notificações:", error);
      return [];
    }
    
    console.log("Notifications data:", data);
    
    if (!data || data.length === 0) {
      console.log("No notifications found, returning mock data");
      // Return mock notifications if no real notifications found
      return getMockNotifications(userId);
    }
    
    // Transform database notifications to our app's notification format
    return data.map(notification => ({
      id: notification.id,
      type: notification.type as "booking" | "application" | "payment" | "review" | "system",
      title: notification.title,
      message: notification.message,
      time: formatTimeAgo(notification.created_at),
      read: notification.read,
      actionUrl: notification.action_url || '#',
      created_at: notification.created_at,
      user_id: notification.user_id
    }));
  } catch (err) {
    console.error("Erro ao buscar notificações:", err);
    return getMockNotifications(userId);
  }
};

// Mark notification as read
export const markNotificationAsRead = async (notificationId: string, userId: string): Promise<boolean> => {
  try {
    console.log("Marking notification as read:", notificationId);
    
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId)
      .eq('user_id', userId);
      
    if (error) {
      console.error("Error marking notification as read:", error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error("Erro ao marcar notificação como lida:", err);
    return false;
  }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async (userId: string): Promise<boolean> => {
  try {
    console.log("Marking all notifications as read for user:", userId);
    
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false);
      
    if (error) {
      console.error("Error marking all notifications as read:", error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error("Erro ao marcar todas notificações como lidas:", err);
    return false;
  }
};

// Create a new notification
export const createNotification = async (
  userId: string, 
  type: "booking" | "application" | "payment" | "review" | "system",
  title: string,
  message: string,
  actionUrl?: string
): Promise<boolean> => {
  try {
    console.log("Creating notification for user:", userId, "type:", type);
    
    const { data, error } = await supabase
      .from('notifications')
      .insert([{ 
        user_id: userId,
        type,
        title,
        message,
        action_url: actionUrl || null,
        read: false
      }])
      .select();
      
    if (error) {
      console.error("Error creating notification:", error);
      return false;
    }
    
    console.log("Notification created successfully:", data);
    return true;
  } catch (err) {
    console.error("Erro ao criar notificação:", err);
    return false;
  }
};
