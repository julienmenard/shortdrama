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
  // Check if browser supports notifications
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }
  
  // Get stored settings
  const settings = getNotificationSettings();
  
  // If notifications are enabled and permission is granted, start scheduler
  if (settings.enabled && Notification.permission === 'granted') {
    startNotificationScheduler();
    return true;
  }
  
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
    return;
  }
  
  console.log('Starting notification scheduler');
  
  // Schedule first notification after a short delay
  const firstDelay = 10000; // 10 seconds for first notification
  
  // Set timeout for first notification
  setTimeout(() => {
    sendFakeNotification();
    
    // Then set interval for every 2 minutes
    notificationTimer = window.setInterval(() => {
      sendFakeNotification();
    }, 2 * 60 * 1000); // 2 minutes in milliseconds
  }, firstDelay);
};

/**
 * Stop sending scheduled notifications
 */
export const stopNotificationScheduler = (): void => {
  if (notificationTimer !== null) {
    clearInterval(notificationTimer);
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
    const notification = new Notification(notificationContent.title, {
      body: notificationContent.body,
      icon: notificationContent.icon,
      silent: false
    });
    
    // Handle notification click
    notification.onclick = () => {
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
  if (Notification.permission !== 'granted') {
    console.log('Cannot enable notifications: permission not granted');
    return false;
  }
  
  const settings: NotificationSettings = {
    enabled: true,
    lastNotificationTime: Date.now()
  };
  
  saveNotificationSettings(settings);
  startNotificationScheduler();
  
  // Show immediate notification to confirm it's working
  new Notification('ShortDrama Notifications Enabled', {
    body: 'You will now receive notifications about new episodes and updates.',
    icon: '/src/pages/logo/heartblood.png'
  });
  
  return true;
};

/**
 * Disable notifications and stop scheduler
 */
export const disableNotifications = (): void => {
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
  localStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(settings));
};

/**
 * Request browser notification permission
 */
export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!('Notification' in window)) {
    throw new Error('Notifications not supported');
  }
  
  if (Notification.permission === 'granted') {
    return 'granted';
  }
  
  if (Notification.permission === 'denied') {
    return 'denied';
  }
  
  try {
    const permission = await Notification.requestPermission();
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
  if (!isNotificationsEnabled() || Notification.permission !== 'granted') {
    return;
  }
  
  try {
    const notification = new Notification(`Now Watching: ${video.title}`, {
      body: video.description.substring(0, 100) + '...',
      icon: video.assets.cover[0]?.url || '/src/pages/logo/heartblood.png',
    });
    
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  } catch (error) {
    console.error('Error sending video notification:', error);
  }
};