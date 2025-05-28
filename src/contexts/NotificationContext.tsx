import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

interface NotificationData {
  id: string;
  title: string;
  body: string;
  icon?: string;
}

interface NotificationContextType {
  showNotification: (notification: Omit<NotificationData, 'id'>) => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const notificationQueue = useRef<NotificationData[]>([]);
  const isProcessingQueue = useRef(false);

  // Process notifications from the queue
  const processQueue = () => {
    if (isProcessingQueue.current || notificationQueue.current.length === 0) {
      return;
    }

    isProcessingQueue.current = true;
    const nextNotification = notificationQueue.current.shift();
    
    if (nextNotification) {
      setNotifications(prev => [...prev, nextNotification]);
      
      // After 5 seconds, remove the notification and process the next one
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== nextNotification.id));
        isProcessingQueue.current = false;
        processQueue();
      }, 5000);
    } else {
      isProcessingQueue.current = false;
    }
  };

  // Watch the queue for changes
  useEffect(() => {
    if (notificationQueue.current.length > 0 && !isProcessingQueue.current) {
      processQueue();
    }
  }, [notifications]);

  const showNotification = (notification: Omit<NotificationData, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newNotification = { ...notification, id };
    
    notificationQueue.current.push(newNotification);
    
    if (!isProcessingQueue.current) {
      processQueue();
    }
  };

  const clearNotifications = () => {
    setNotifications([]);
    notificationQueue.current = [];
    isProcessingQueue.current = false;
  };

  return (
    <NotificationContext.Provider value={{ showNotification, clearNotifications }}>
      {children}
      {notifications.map((notification) => (
        <div key={notification.id} className="notification-wrapper">
          {/* Your notification component will be rendered here */}
        </div>
      ))}
    </NotificationContext.Provider>
  );
};