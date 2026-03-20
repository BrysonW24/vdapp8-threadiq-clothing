/**
 * ThreadIQ Notification Service
 * Schedules post-event outfit photo reminders
 */

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

class NotificationService {
  private permissionGranted = false;

  async requestPermission(): Promise<boolean> {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    this.permissionGranted = finalStatus === 'granted';

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('events', {
        name: 'Event Reminders',
        importance: Notifications.AndroidImportance.HIGH,
      });
    }

    return this.permissionGranted;
  }

  /**
   * Schedule a "Snap your outfit!" reminder for after an event
   * Fires 30 minutes after the event end time
   */
  async schedulePostEventReminder(
    eventId: string,
    eventTitle: string,
    eventEndDate: string,
  ): Promise<string | null> {
    if (!this.permissionGranted) {
      const granted = await this.requestPermission();
      if (!granted) return null;
    }

    const triggerDate = new Date(eventEndDate);
    triggerDate.setMinutes(triggerDate.getMinutes() + 30); // 30 min after event

    // Don't schedule if the trigger is in the past
    if (triggerDate.getTime() <= Date.now()) return null;

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'How did your outfit turn out? ✨',
        body: `Snap a pic of your look from "${eventTitle}" and share it!`,
        data: { type: 'post-event-capture', eventId },
        categoryIdentifier: 'post-event',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: triggerDate,
      },
    });

    return id;
  }

  /**
   * Schedule outfit planning reminder for upcoming event
   * Fires 24 hours before the event
   */
  async scheduleOutfitPlanReminder(
    eventId: string,
    eventTitle: string,
    eventDate: string,
  ): Promise<string | null> {
    if (!this.permissionGranted) {
      const granted = await this.requestPermission();
      if (!granted) return null;
    }

    const triggerDate = new Date(eventDate);
    triggerDate.setHours(triggerDate.getHours() - 24); // 24h before

    if (triggerDate.getTime() <= Date.now()) return null;

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: `${eventTitle} is tomorrow! 👗`,
        body: 'Plan your outfit now so you\'re ready to go',
        data: { type: 'outfit-plan', eventId },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: triggerDate,
      },
    });

    return id;
  }

  async cancelNotification(notificationId: string): Promise<void> {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }

  async cancelAllNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }
}

export default new NotificationService();
