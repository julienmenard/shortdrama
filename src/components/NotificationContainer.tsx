import React, { useState, useEffect } from 'react';
import InAppNotification from './InAppNotification';

interface Notification {
  id: string;
  title: string;
  body: string;
  icon?: string;
}

const NotificationContainer: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // Listen for custom notification events
  useEffect(() => {
    const handleNotificationEvent = (event: CustomEvent) => {
      const notification = event.detail;
      if (notification) {
        const id = Date.now().toString();
        setNotifications(prev => [...prev, { ...notification, id }]);
        
        // Remove notification after it's shown
        setTimeout(() => {
          setNotifications(prev => prev.filter(n => n.id !== id));
        }, 6000); // 5000ms display + 1000ms for animation
      }
    };

    // Add event listener
    window.addEventListener('in-app-notification' as any, handleNotificationEvent as EventListener);
    
    // Clean up
    return () => {
      window.removeEventListener('in-app-notification' as any, handleNotificationEvent as EventListener);
    };
  }, []);

  // Only show the most recent notification
  const currentNotification = notifications.length > 0 ? notifications[0] : null;

  if (!currentNotification) return null;

  return (
    <InAppNotification
      title={currentNotification.title}
      body={currentNotification.body}
      icon={currentNotification.icon}
      onClose={() => {
        setNotifications(prev => prev.filter(n => n.id !== currentNotification.id));
      }}
    />
  );
};

export default NotificationContainer;