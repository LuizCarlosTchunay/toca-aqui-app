
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
      console.log("No notifications found for user");
      return [];
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
    return [];
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

// Get unread notifications count
export const getUnreadNotificationsCount = async (userId: string): Promise<number> => {
  try {
    console.log("Getting unread notifications count for user:", userId);
    
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('read', false);
      
    if (error) {
      console.error("Error getting unread notifications count:", error);
      return 0;
    }
    
    return count || 0;
  } catch (err) {
    console.error("Erro ao obter contagem de notificações não lidas:", err);
    return 0;
  }
};
