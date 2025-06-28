
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

// Cache for notifications to avoid excessive API calls
const notificationCache = new Map<string, { data: Notification[], timestamp: number }>();
const CACHE_DURATION = 30000; // 30 seconds

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

// Optimized fetch with caching
export const fetchRealNotifications = async (userId: string, useCache: boolean = true): Promise<Notification[]> => {
  try {
    if (!userId) {
      console.warn("User ID is required to fetch notifications");
      return [];
    }

    // Check cache first if enabled
    if (useCache) {
      const cached = notificationCache.get(userId);
      if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
        console.log("Returning cached notifications for user:", userId);
        return cached.data;
      }
    }
    
    console.log("Fetching REAL notifications from database for user:", userId);
    
    // Optimized query with selective fields
    const { data, error } = await supabase
      .from('notifications')
      .select('id, type, title, message, read, action_url, created_at, user_id')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(100); // Increased limit but still reasonable
      
    if (error) {
      console.error("Erro ao buscar notificações reais:", error);
      logSecurityEvent("notification_fetch_error", userId, error);
      return [];
    }
    
    if (!data || data.length === 0) {
      console.log("No REAL notifications found for user:", userId);
      // Cache empty result too
      notificationCache.set(userId, { data: [], timestamp: Date.now() });
      return [];
    }
    
    // Transform database notifications to our app's notification format
    const realNotifications = data.map(notification => ({
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

    // Update cache
    if (useCache) {
      notificationCache.set(userId, { data: realNotifications, timestamp: Date.now() });
    }
    
    console.log("Final REAL notifications processed:", realNotifications.length);
    return realNotifications;
  } catch (err) {
    console.error("Erro ao buscar notificações reais:", err);
    logSecurityEvent("notification_fetch_exception", userId, err);
    return [];
  }
};

// Clear cache when notifications change
const clearNotificationCache = (userId: string) => {
  notificationCache.delete(userId);
  console.log("Cleared notification cache for user:", userId);
};

// Mark notification as read - ONLY user's own notifications
export const markNotificationAsRead = async (notificationId: string, userId: string): Promise<boolean> => {
  try {
    if (!notificationId || !userId) {
      console.warn("Notification ID and User ID are required");
      return false;
    }
    
    console.log("Marking REAL notification as read:", notificationId, "for user:", userId);
    
    // RLS will automatically ensure user can only update their own notifications
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId)
      .eq('user_id', userId); // Extra security check
      
    if (error) {
      console.error("Error marking REAL notification as read:", error);
      logSecurityEvent("notification_read_error", userId, { notificationId, error });
      return false;
    }
    
    // Clear cache to force refresh
    clearNotificationCache(userId);
    
    console.log("REAL notification marked as read successfully");
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
    
    console.log("Marking all REAL notifications as read for user:", userId);
    
    // RLS will automatically ensure user can only update their own notifications
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('read', false)
      .eq('user_id', userId); // Extra security check
      
    if (error) {
      console.error("Error marking all REAL notifications as read:", error);
      logSecurityEvent("notification_read_all_error", userId, error);
      return false;
    }
    
    // Clear cache to force refresh
    clearNotificationCache(userId);
    
    console.log("All REAL notifications marked as read successfully");
    return true;
  } catch (err) {
    console.error("Erro ao marcar todas notificações reais como lidas:", err);
    logSecurityEvent("notification_read_all_exception", userId, err);
    return false;
  }
};

// Create a new REAL notification with optimized performance
export const createNotification = async (
  userId: string, 
  type: "booking" | "application" | "payment" | "review" | "system",
  title: string,
  message: string,
  actionUrl?: string
): Promise<boolean> => {
  try {
    if (!userId || !type || !title || !message) {
      console.warn("All required fields must be provided for REAL notification");
      return false;
    }
    
    // Validate notification data
    const validation = validateNotificationData({ title, message, type });
    if (!validation.isValid) {
      console.error("REAL notification validation failed:", validation.errors);
      return false;
    }
    
    console.log("Creating REAL notification for user:", userId, "type:", type);
    
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
      console.error("Error creating REAL notification:", error);
      logSecurityEvent("notification_create_error", userId, { type, error });
      return false;
    }
    
    // Clear cache to ensure fresh data on next fetch
    clearNotificationCache(userId);
    
    console.log("REAL notification created successfully:", data);
    return true;
  } catch (err) {
    console.error("Erro ao criar notificação real:", err);
    logSecurityEvent("notification_create_exception", userId, { type, error: err });
    return false;
  }
};

// Get unread notifications count with caching
export const getUnreadNotificationsCount = async (userId: string): Promise<number> => {
  try {
    if (!userId) {
      console.warn("User ID is required");
      return 0;
    }
    
    console.log("Getting REAL unread notifications count for user:", userId);
    
    // Use count query for better performance
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('read', false)
      .eq('user_id', userId); // Extra security check
      
    if (error) {
      console.error("Error getting REAL unread notifications count:", error);
      logSecurityEvent("notification_count_error", userId, error);
      return 0;
    }
    
    const unreadCount = count || 0;
    console.log("REAL unread notifications count:", unreadCount);
    return unreadCount;
  } catch (err) {
    console.error("Erro ao obter contagem de notificações reais não lidas:", err);
    logSecurityEvent("notification_count_exception", userId, err);
    return 0;
  }
};

// Delete old notifications - ONLY user's own notifications (background cleanup)
export const deleteOldNotifications = async (userId: string, daysOld: number = 30): Promise<boolean> => {
  try {
    if (!userId || daysOld < 1) {
      console.warn("Valid user ID and days parameter required");
      return false;
    }
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    
    console.log("Deleting old REAL notifications for user:", userId, "older than:", cutoffDate);
    
    // RLS will automatically ensure user can only delete their own notifications
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('user_id', userId)
      .lt('created_at', cutoffDate.toISOString());
      
    if (error) {
      console.error("Error deleting old REAL notifications:", error);
      return false;
    }
    
    // Clear cache after cleanup
    clearNotificationCache(userId);
    
    console.log("Old REAL notifications deleted successfully");
    return true;
  } catch (err) {
    console.error("Erro ao deletar notificações reais antigas:", err);
    return false;
  }
};

// Batch create notifications for multiple users (optimized)
export const createBatchNotifications = async (
  userIds: string[],
  type: "booking" | "application" | "payment" | "review" | "system",
  title: string,
  message: string,
  actionUrl?: string
): Promise<boolean> => {
  try {
    if (!userIds.length || !type || !title || !message) {
      console.warn("All required fields must be provided for batch notifications");
      return false;
    }

    console.log("Creating batch REAL notifications for", userIds.length, "users");

    // Sanitize input
    const sanitizedTitle = sanitizeText(title, 200);
    const sanitizedMessage = sanitizeText(message, 500);
    const sanitizedActionUrl = actionUrl ? sanitizeText(actionUrl, 300) : null;

    // Create notifications for all users in one query
    const notifications = userIds.map(userId => ({
      user_id: userId,
      type,
      title: sanitizedTitle,
      message: sanitizedMessage,
      action_url: sanitizedActionUrl,
      read: false
    }));

    const { error } = await supabase
      .from('notifications')
      .insert(notifications);

    if (error) {
      console.error("Error creating batch notifications:", error);
      return false;
    }

    // Clear cache for all affected users
    userIds.forEach(userId => clearNotificationCache(userId));

    console.log("Batch REAL notifications created successfully");
    return true;
  } catch (err) {
    console.error("Erro ao criar notificações em lote:", err);
    return false;
  }
};
