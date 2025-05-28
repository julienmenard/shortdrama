import { VideoData } from '../types';

// Store for notification settings
const NOTIFICATION_SETTINGS_KEY = 'notification_settings';

interface NotificationSettings {
  enabled: boolean;
  lastNotificationTime?: number;
}

// Sample notification content to display
const sampleNotifications = [
  {
    title: "New Episode Available",
    body: "Hollywood Star's Fake Girlfriend S01E05 is now streaming!",
    icon: "/src/pages/logo/heartblood.png"
  },
  {
    title: "Continue Watching",
    body: "Continue watching Mafia Lord's Son Has Secret Love For His Stepmom",
    icon: "/src/pages/logo/heartblood.png"
  },
  {
    title: "Weekly Recommendation",
    body: "Based on your watch history, you might enjoy 'Hidden Identity'",
    icon: "/src/pages/logo/heartblood.png"
  },
  {
    title: "Content Update",
    body: "5 new series have been added to our library this week!",
    icon: "/src/pages/logo/heartblood.png"
  },
  {
    title: "Premium Offer",
    body: "Upgrade to Premium today and get 15% off your first month!",
    icon: "/src/pages/logo/heartblood.png"
  }
];

// Timer reference for cleanup
let notificationTimer: number | null = null;

/**
 * Initialize notification system and check permissions
 */
export const initNotifications = (): boolean => {
  console.log('Initializing notification system');
  
  // Check if browser supports notifications
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }
  
  // Get stored settings
  const settings = getNotificationSettings();
  console.log('Current notification settings:', settings);
  
  // If notifications are enabled and permission is granted, start scheduler
  if (settings.enabled && Notification.permission === 'granted') {
    console.log('Notifications are enabled and permission is granted');
    startNotificationScheduler();
    return true;
  }
  
  console.log('Notifications not started: enabled =', settings.enabled, 
              'permission =', Notification.permission);
  return false;
};

/**
 * Start sending scheduled notifications
 */
export const startNotificationScheduler = (): void => {
  // Clear any existing timer
  stopNotificationScheduler();
  
  // Only proceed if notifications are enabled and permission is granted
  if (!isNotificationsEnabled() || Notification.permission !== 'granted') {
    console.log('Cannot start scheduler: enabled =', isNotificationsEnabled(), 
                'permission =', Notification.permission);
    return;
  }
  
  console.log('Starting notification scheduler');
  
  // Schedule first notification immediately
  sendFakeNotification();
  
  // Then set interval for notifications every 30 seconds (for testing purposes)
  notificationTimer = window.setInterval(() => {
    console.log('Sending scheduled notification');
    sendFakeNotification();
  }, 30 * 1000); // 30 seconds for testing purposes
  
  console.log('Notification timer set:', notificationTimer);
};

/**
 * Stop sending scheduled notifications
 */
export const stopNotificationScheduler = (): void => {
  if (notificationTimer !== null) {
    console.log('Clearing notification timer:', notificationTimer);
    window.clearInterval(notificationTimer);
    notificationTimer = null;
    console.log('Notification scheduler stopped');
  }
};

/**
 * Send a fake notification with random content
 */
export const sendFakeNotification = (): void => {
  if (Notification.permission !== 'granted') {
    console.log('Cannot send notification: permission not granted');
    return;
  }
  
  // Get a random notification content
  const randomIndex = Math.floor(Math.random() * sampleNotifications.length);
  const notificationContent = sampleNotifications[randomIndex];
  
  // Create and show the notification
  try {
    console.log('Sending notification:', notificationContent.title);
    
    const notification = new Notification(notificationContent.title, {
      body: notificationContent.body,
      icon: notificationContent.icon,
      badge: "/src/pages/logo/heartblood.png",
      tag: 'shortdrama-notification',
      requireInteraction: true
    });
    
    // Handle notification click
    notification.onclick = () => {
      console.log('Notification clicked');
      window.focus();
      notification.close();
    };
    
    // Update last notification time
    const settings = getNotificationSettings();
    settings.lastNotificationTime = Date.now();
    saveNotificationSettings(settings);
    
    console.log('Sent notification:', notificationContent.title);
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};

/**
 * Check if notifications are enabled by the user
 */
export const isNotificationsEnabled = (): boolean => {
  const settings = getNotificationSettings();
  return settings.enabled;
};

/**
 * Enable notifications and start scheduler
 */
export const enableNotifications = (): boolean => {
  console.log('Enabling notifications');
  
  if (Notification.permission !== 'granted') {
    console.log('Cannot enable notifications: permission not granted');
    return false;
  }
  
  const settings: NotificationSettings = {
    enabled: true,
    lastNotificationTime: Date.now()
  };
  
  saveNotificationSettings(settings);
  
  // Send immediate welcome notification
  try {
    console.log('Sending welcome notification');
    const notification = new Notification('ShortDrama Notifications Enabled', {
      body: 'You will now receive notifications about new episodes and updates.',
      icon: '/src/pages/logo/heartblood.png',
      requireInteraction: true
    });
    
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  } catch (error) {
    console.error('Error sending welcome notification:', error);
  }
  
  // Start the notification scheduler after a brief delay
  setTimeout(() => {
    startNotificationScheduler();
  }, 2000);
  
  return true;
};

/**
 * Disable notifications and stop scheduler
 */
export const disableNotifications = (): void => {
  console.log('Disabling notifications');
  
  const settings: NotificationSettings = {
    enabled: false
  };
  
  saveNotificationSettings(settings);
  stopNotificationScheduler();
};

/**
 * Get notification settings from localStorage
 */
export const getNotificationSettings = (): NotificationSettings => {
  const storedSettings = localStorage.getItem(NOTIFICATION_SETTINGS_KEY);
  if (storedSettings) {
    try {
      return JSON.parse(storedSettings);
    } catch (e) {
      // If parsing fails, return default settings
      return { enabled: false };
    }
  }
  return { enabled: false };
};

/**
 * Save notification settings to localStorage
 */
export const saveNotificationSettings = (settings: NotificationSettings): void => {
  console.log('Saving notification settings:', settings);
  localStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(settings));
};

/**
 * Request browser notification permission
 */
export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  console.log('Requesting notification permission');
  
  if (!('Notification' in window)) {
    console.error('Notifications not supported in this browser');
    throw new Error('Notifications not supported');
  }
  
  if (Notification.permission === 'granted') {
    console.log('Notification permission already granted');
    return 'granted';
  }
  
  if (Notification.permission === 'denied') {
    console.log('Notification permission previously denied');
    return 'denied';
  }
  
  try {
    console.log('Calling Notification.requestPermission()');
    const permission = await Notification.requestPermission();
    console.log('Permission result:', permission);
    return permission;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    throw error;
  }
};

/**
 * Create a notification about a specific video
 */
export const sendVideoNotification = (video: VideoData): void => {
  console.log('Attempting to send video notification');
  
  if (!isNotificationsEnabled()) {
    console.log('Video notification not sent: notifications not enabled');
    return;
  }
  
  if (Notification.permission !== 'granted') {
    console.log('Video notification not sent: permission not granted');
    return;
  }
  
  try {
    console.log('Sending video notification for:', video.title);
    
    const notification = new Notification(`Now Watching: ${video.title}`, {
      body: video.description.substring(0, 100) + '...',
      icon: video.assets.cover[0]?.url || '/src/pages/logo/heartblood.png',
      requireInteraction: true,
      tag: 'shortdrama-video'
    });
    
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
    
    console.log('Video notification sent successfully');
  } catch (error) {
    console.error('Error sending video notification:', error);
  }
};

// Testing function to force a notification immediately (for debugging)
export const forceTestNotification = (): void => {
  try {
    console.log('Forcing test notification');
    
    if (Notification.permission !== 'granted') {
      console.log('Cannot send test notification: permission not granted');
      return;
    }
    
    const notification = new Notification('Test Notification', {
      body: 'This is a test notification from ShortDrama',
      icon: '/src/pages/logo/heartblood.png',
      requireInteraction: true
    });
    
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
    
    console.log('Test notification sent');
  } catch (error) {
    console.error('Error sending test notification:', error);
  }
};