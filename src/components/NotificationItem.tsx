
import React from 'react';
import { Calendar, CheckCheck, UserCheck, DollarSign, Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Notification } from '@/utils/notifications';

interface NotificationItemProps {
  notification: Notification;
  onClick: (notification: Notification) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onClick }) => {
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
    <div 
      className={`p-4 border ${notification.read ? 'border-toca-border' : 'border-toca-accent'} rounded-md flex cursor-pointer hover:bg-toca-background/30 transition-colors`}
      onClick={() => onClick(notification)}
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
              onClick(notification);
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
  );
};

export default NotificationItem;
