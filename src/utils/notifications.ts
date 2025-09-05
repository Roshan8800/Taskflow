import AsyncStorage from '@react-native-async-storage/async-storage';

interface NotificationData {
  id: string;
  title: string;
  body: string;
  scheduledTime: Date;
  taskId?: string;
}

interface MissedNotification {
  id: string;
  title: string;
  body: string;
  missedTime: Date;
}

export const scheduleNotification = async (data: NotificationData) => {
  try {
    // Store notification for tracking
    const stored = await AsyncStorage.getItem('scheduledNotifications');
    const notifications = stored ? JSON.parse(stored) : [];
    notifications.push(data);
    await AsyncStorage.setItem('scheduledNotifications', JSON.stringify(notifications));
  } catch (error) {
    console.error('Failed to schedule notification:', error);
  }
};

export const cancelNotification = async (id: string) => {
  try {
    const stored = await AsyncStorage.getItem('scheduledNotifications');
    if (stored) {
      const notifications = JSON.parse(stored);
      const filtered = notifications.filter((n: NotificationData) => n.id !== id);
      await AsyncStorage.setItem('scheduledNotifications', JSON.stringify(filtered));
    }
  } catch (error) {
    console.error('Failed to cancel notification:', error);
  }
};

export const checkMissedNotifications = async (): Promise<MissedNotification[]> => {
  try {
    const stored = await AsyncStorage.getItem('scheduledNotifications');
    if (!stored) return [];

    const notifications: NotificationData[] = JSON.parse(stored);
    const now = new Date();
    const missed: MissedNotification[] = [];
    const remaining: NotificationData[] = [];

    notifications.forEach(notification => {
      const scheduledTime = new Date(notification.scheduledTime);
      if (scheduledTime < now) {
        missed.push({
          id: notification.id,
          title: notification.title,
          body: notification.body,
          missedTime: scheduledTime
        });
      } else {
        remaining.push(notification);
      }
    });

    // Update stored notifications (remove missed ones)
    await AsyncStorage.setItem('scheduledNotifications', JSON.stringify(remaining));
    
    return missed;
  } catch (error) {
    console.error('Failed to check missed notifications:', error);
    return [];
  }
};

export const showMissedNotificationsAlert = (missed: MissedNotification[]) => {
  if (missed.length === 0) return;
  
  const count = missed.length;
  const message = count === 1 
    ? `You missed 1 reminder: ${missed[0].title}`
    : `You missed ${count} reminders`;
    
  // Show alert or notification
  console.log('Missed notifications:', message);
};

export const snoozeNotification = async (
  notificationId: string, 
  snoozeMinutes: number, 
  strictMode: boolean = false
) => {
  try {
    const stored = await AsyncStorage.getItem('scheduledNotifications');
    if (!stored) return;

    const notifications: NotificationData[] = JSON.parse(stored);
    const notification = notifications.find(n => n.id === notificationId);
    
    if (notification) {
      const newTime = new Date(Date.now() + snoozeMinutes * 60 * 1000);
      
      if (strictMode) {
        // Keep original + create new snoozed reminder
        const snoozedNotification = {
          ...notification,
          id: `${notification.id}_snoozed_${Date.now()}`,
          scheduledTime: newTime
        };
        notifications.push(snoozedNotification);
      } else {
        // Replace original with snoozed time
        notification.scheduledTime = newTime;
      }
      
      await AsyncStorage.setItem('scheduledNotifications', JSON.stringify(notifications));
    }
  } catch (error) {
    console.error('Failed to snooze notification:', error);
  }
};

export const checkNotificationPermission = async (): Promise<boolean> => {
  // Placeholder - would use actual notification permission check
  const hasPermission = await AsyncStorage.getItem('notificationPermission');
  return hasPermission === 'granted';
};

export const showNotificationPermissionPrompt = () => {
  // Show soft prompt to enable in Settings
  console.log('Please enable notifications in Settings to receive reminders');
};