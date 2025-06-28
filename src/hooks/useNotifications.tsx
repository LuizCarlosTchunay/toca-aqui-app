
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { 
  fetchRealNotifications, 
  getUnreadNotificationsCount,
  type Notification 
} from '@/utils/notifications';
import { toast } from 'sonner';

export const useNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch notifications from database
  const refreshNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    try {
      setIsLoading(true);
      console.log('Refreshing notifications for user:', user.id);
      
      const [fetchedNotifications, unreadCountResult] = await Promise.all([
        fetchRealNotifications(user.id),
        getUnreadNotificationsCount(user.id)
      ]);

      setNotifications(fetchedNotifications);
      setUnreadCount(unreadCountResult);
      
      console.log('Notifications refreshed:', fetchedNotifications.length, 'unread:', unreadCountResult);
    } catch (error) {
      console.error('Error refreshing notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Set up real-time subscription
  useEffect(() => {
    if (!user) return;

    console.log('Setting up real-time notifications for user:', user.id);

    // Initial fetch
    refreshNotifications();

    // Set up real-time subscription for new notifications
    const channel = supabase
      .channel('user-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('New notification received via real-time:', payload);
          
          const newNotification = payload.new as any;
          
          // Show toast for new notification
          toast.success(`Nova notificação: ${newNotification.title}`, {
            description: newNotification.message,
            action: {
              label: "Ver",
              onClick: () => {
                // Navigate to notifications page or specific action
                if (newNotification.action_url && newNotification.action_url !== '#') {
                  window.location.href = newNotification.action_url;
                } else {
                  window.location.href = '/notifications';
                }
              }
            }
          });

          // Refresh notifications to get updated list
          refreshNotifications();

          // Show browser notification if supported and permitted
          if ('Notification' in window && window.Notification.permission === 'granted') {
            new window.Notification(newNotification.title, {
              body: newNotification.message,
              icon: '/lovable-uploads/66d87de3-4ebd-4f4b-9d3f-c9bbb3e3c4ef.png',
              badge: '/lovable-uploads/66d87de3-4ebd-4f4b-9d3f-c9bbb3e3c4ef.png',
              tag: newNotification.id,
              requireInteraction: true
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Notification updated via real-time:', payload);
          refreshNotifications();
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up notifications subscription');
      supabase.removeChannel(channel);
    };
  }, [user, refreshNotifications]);

  // Request notification permission
  const requestNotificationPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    if (window.Notification.permission === 'granted') {
      return true;
    }

    if (window.Notification.permission !== 'denied') {
      const permission = await window.Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }, []);

  // Register service worker for push notifications
  const registerPushNotifications = useCallback(async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.log('Push notifications are not supported');
      return false;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      console.log('Service worker is ready for push notifications');
      return true;
    } catch (error) {
      console.error('Error setting up push notifications:', error);
      return false;
    }
  }, []);

  // Initialize notification system
  useEffect(() => {
    const initNotifications = async () => {
      const permissionGranted = await requestNotificationPermission();
      if (permissionGranted) {
        await registerPushNotifications();
        console.log('Notification system initialized successfully');
      }
    };

    initNotifications();
  }, [requestNotificationPermission, registerPushNotifications]);

  return {
    notifications,
    unreadCount,
    isLoading,
    refreshNotifications,
    requestNotificationPermission,
    registerPushNotifications
  };
};
