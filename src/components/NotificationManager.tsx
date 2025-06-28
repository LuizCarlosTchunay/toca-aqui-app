
import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import { toast } from 'sonner';

const NotificationManager: React.FC = () => {
  const { user } = useAuth();
  const { requestNotificationPermission, registerPushNotifications } = useNotifications();

  useEffect(() => {
    if (!user) return;

    const initializeNotifications = async () => {
      try {
        // Request notification permission
        const permissionGranted = await requestNotificationPermission();
        
        if (permissionGranted) {
          console.log('Notification permission granted');
          
          // Register for push notifications
          const pushRegistered = await registerPushNotifications();
          
          if (pushRegistered) {
            console.log('Push notifications registered successfully');
          }
        } else {
          console.log('Notification permission denied');
          // Show a subtle message about missing notifications
          toast.info('Ative as notificações para não perder atualizações importantes!', {
            action: {
              label: "Ativar",
              onClick: () => {
                // Try to request permission again
                requestNotificationPermission();
              }
            }
          });
        }
      } catch (error) {
        console.error('Error initializing notifications:', error);
      }
    };

    // Small delay to ensure everything is loaded
    const timer = setTimeout(initializeNotifications, 2000);
    
    return () => clearTimeout(timer);
  }, [user, requestNotificationPermission, registerPushNotifications]);

  // This component doesn't render anything visible
  return null;
};

export default NotificationManager;
