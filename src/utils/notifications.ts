
import { supabase } from "@/integrations/supabase/client";
import { sanitizeText, validateNotificationData, logSecurityEvent } from "./securityValidation";

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
  try {
    const date = new Date(dateString);
    const now = new Date();
    
    if (isNaN(date.getTime())) {
      return 'Data inválida';
    }
    
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);
    
    if (diffMins < 1) {
      return 'agora';
    } else if (diffMins < 60) {
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
  } catch (error) {
    console.error('Error formatting time:', error);
    return 'Data inválida';
  }
};

// Fetch real notifications from the Supabase database - ONLY user's own notifications
export const fetchRealNotifications = async (userId: string): Promise<Notification[]> => {
  try {
    if (!userId) {
      console.warn("User ID is required to fetch notifications");
      return [];
    }
    
    console.log("Fetching real notifications for user:", userId);
    
    // RLS will automatically filter to user's own notifications
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50); // Reasonable limit for performance
      
    if (error) {
      console.error("Erro ao buscar notificações reais:", error);
      logSecurityEvent("notification_fetch_error", userId, error);
      return [];
    }
    
    console.log("Real notifications data for user:", userId, data);
    
    if (!data || data.length === 0) {
      console.log("No real notifications found for user:", userId);
      return [];
    }
    
    // Transform database notifications to our app's notification format
    return data.map(notification => ({
      id: notification.id,
      type: notification.type as "booking" | "application" | "payment" | "review" | "system",
      title: sanitizeText(notification.title, 200),
      message: sanitizeText(notification.message, 500),
      time: formatTimeAgo(notification.created_at),
      read: Boolean(notification.read),
      actionUrl: notification.action_url ? sanitizeText(notification.action_url, 300) : '#',
      created_at: notification.created_at,
      user_id: notification.user_id
    }));
  } catch (err) {
    console.error("Erro ao buscar notificações reais:", err);
    logSecurityEvent("notification_fetch_exception", userId, err);
    return [];
  }
};

// Mark notification as read - ONLY user's own notifications
export const markNotificationAsRead = async (notificationId: string, userId: string): Promise<boolean> => {
  try {
    if (!notificationId || !userId) {
      console.warn("Notification ID and User ID are required");
      return false;
    }
    
    console.log("Marking real notification as read:", notificationId, "for user:", userId);
    
    // RLS will automatically ensure user can only update their own notifications
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId)
      .eq('user_id', userId); // Extra security check
      
    if (error) {
      console.error("Error marking real notification as read:", error);
      logSecurityEvent("notification_read_error", userId, { notificationId, error });
      return false;
    }
    
    console.log("Real notification marked as read successfully");
    return true;
  } catch (err) {
    console.error("Erro ao marcar notificação real como lida:", err);
    logSecurityEvent("notification_read_exception", userId, { notificationId, error: err });
    return false;
  }
};

// Mark all notifications as read - ONLY user's own notifications
export const markAllNotificationsAsRead = async (userId: string): Promise<boolean> => {
  try {
    if (!userId) {
      console.warn("User ID is required");
      return false;
    }
    
    console.log("Marking all real notifications as read for user:", userId);
    
    // RLS will automatically ensure user can only update their own notifications
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('read', false)
      .eq('user_id', userId); // Extra security check
      
    if (error) {
      console.error("Error marking all real notifications as read:", error);
      logSecurityEvent("notification_read_all_error", userId, error);
      return false;
    }
    
    console.log("All real notifications marked as read successfully");
    return true;
  } catch (err) {
    console.error("Erro ao marcar todas notificações reais como lidas:", err);
    logSecurityEvent("notification_read_all_exception", userId, err);
    return false;
  }
};

// Create a new real notification
export const createNotification = async (
  userId: string, 
  type: "booking" | "application" | "payment" | "review" | "system",
  title: string,
  message: string,
  actionUrl?: string
): Promise<boolean> => {
  try {
    if (!userId || !type || !title || !message) {
      console.warn("All required fields must be provided for real notification");
      return false;
    }
    
    // Validate notification data
    const validation = validateNotificationData({ title, message, type });
    if (!validation.isValid) {
      console.error("Real notification validation failed:", validation.errors);
      return false;
    }
    
    console.log("Creating real notification for user:", userId, "type:", type);
    
    // Sanitize input to prevent XSS
    const sanitizedTitle = sanitizeText(title, 200);
    const sanitizedMessage = sanitizeText(message, 500);
    const sanitizedActionUrl = actionUrl ? sanitizeText(actionUrl, 300) : null;
    
    const { data, error } = await supabase
      .from('notifications')
      .insert([{ 
        user_id: userId,
        type,
        title: sanitizedTitle,
        message: sanitizedMessage,
        action_url: sanitizedActionUrl,
        read: false
      }])
      .select();
      
    if (error) {
      console.error("Error creating real notification:", error);
      logSecurityEvent("notification_create_error", userId, { type, error });
      return false;
    }
    
    console.log("Real notification created successfully:", data);
    return true;
  } catch (err) {
    console.error("Erro ao criar notificação real:", err);
    logSecurityEvent("notification_create_exception", userId, { type, error: err });
    return false;
  }
};

// Get unread notifications count - ONLY user's own notifications
export const getUnreadNotificationsCount = async (userId: string): Promise<number> => {
  try {
    if (!userId) {
      console.warn("User ID is required");
      return 0;
    }
    
    console.log("Getting real unread notifications count for user:", userId);
    
    // RLS will automatically ensure user can only see their own notifications
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('read', false)
      .eq('user_id', userId); // Extra security check
      
    if (error) {
      console.error("Error getting real unread notifications count:", error);
      logSecurityEvent("notification_count_error", userId, error);
      return 0;
    }
    
    console.log("Real unread notifications count:", count);
    return count || 0;
  } catch (err) {
    console.error("Erro ao obter contagem de notificações reais não lidas:", err);
    logSecurityEvent("notification_count_exception", userId, err);
    return 0;
  }
};

// Delete old notifications - ONLY user's own notifications
export const deleteOldNotifications = async (userId: string, daysOld: number = 30): Promise<boolean> => {
  try {
    if (!userId || daysOld < 1) {
      console.warn("Valid user ID and days parameter required");
      return false;
    }
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    
    console.log("Deleting old real notifications for user:", userId, "older than:", cutoffDate);
    
    // RLS will automatically ensure user can only delete their own notifications
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('user_id', userId)
      .lt('created_at', cutoffDate.toISOString());
      
    if (error) {
      console.error("Error deleting old real notifications:", error);
      return false;
    }
    
    console.log("Old real notifications deleted successfully");
    return true;
  } catch (err) {
    console.error("Erro ao deletar notificações reais antigas:", err);
    return false;
  }
};
