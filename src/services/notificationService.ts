// ============================================================
// Notification Service - Expo Notifications
// Schedule check-in reminders 15 min before booking
// ============================================================

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { Booking } from '../types';
import { getNotificationTriggerDate } from '../utils/helpers';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Request notification permissions
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  if (!Device.isDevice) {
    console.log('Notifications require a physical device');
    return false;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Notification permission not granted');
    return false;
  }

  // Android channel setup
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('booking-reminders', {
      name: 'Booking Reminders',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#6C63FF',
      sound: 'default',
    });
  }

  return true;
}

/**
 * Schedule a reminder notification 15 minutes before booking
 */
export async function scheduleBookingReminder(booking: Booking): Promise<string | null> {
  try {
    const triggerDate = getNotificationTriggerDate(booking.date, booking.startTime);
    const now = new Date();

    // Don't schedule if the trigger time has already passed
    if (triggerDate <= now) {
      console.log('Notification trigger time has already passed');
      return null;
    }

    const secondsUntilTrigger = Math.floor((triggerDate.getTime() - now.getTime()) / 1000);

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: '🔔 Check-in Reminder',
        body: `Phòng ${booking.roomName} sẽ bắt đầu trong 15 phút!\n⏰ ${booking.timeSlotLabel}\n📍 Tòa ${booking.building}, Tầng ${booking.floor}`,
        data: {
          bookingId: booking.id,
          roomId: booking.roomId,
          type: 'booking-reminder',
        },
        sound: 'default',
        ...(Platform.OS === 'android' && { channelId: 'booking-reminders' }),
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: secondsUntilTrigger,
      },
    });

    console.log(`Scheduled notification ${notificationId} for booking ${booking.id}`);
    return notificationId;
  } catch (error) {
    console.error('Error scheduling notification:', error);
    return null;
  }
}

/**
 * Cancel a scheduled notification
 */
export async function cancelBookingReminder(notificationId: string): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
    console.log(`Cancelled notification ${notificationId}`);
  } catch (error) {
    console.error('Error cancelling notification:', error);
  }
}

/**
 * Cancel all scheduled notifications
 */
export async function cancelAllReminders(): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('All notifications cancelled');
  } catch (error) {
    console.error('Error cancelling all notifications:', error);
  }
}

/**
 * Get all scheduled notifications
 */
export async function getScheduledReminders() {
  return Notifications.getAllScheduledNotificationsAsync();
}
