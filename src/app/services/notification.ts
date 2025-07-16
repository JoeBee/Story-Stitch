import { Injectable } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly VAPID_PUBLIC_KEY = 'YOUR_VAPID_PUBLIC_KEY'; // Replace with actual VAPID key
  private isOnlineSubject = new BehaviorSubject<boolean>(navigator.onLine);
  public isOnline$ = this.isOnlineSubject.asObservable();

  constructor(private swPush: SwPush) {
    this.setupNetworkListeners();
    this.setupDailyNotifications();
  }

  private setupNetworkListeners(): void {
    window.addEventListener('online', () => {
      this.isOnlineSubject.next(true);
    });

    window.addEventListener('offline', () => {
      this.isOnlineSubject.next(false);
    });
  }

  async requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  async subscribeToPushNotifications(): Promise<void> {
    if (!this.swPush.isEnabled) {
      console.warn('Service worker is not enabled');
      return;
    }

    try {
      const subscription = await this.swPush.requestSubscription({
        serverPublicKey: this.VAPID_PUBLIC_KEY
      });

      // In a real app, send this subscription to your server
      console.log('Push subscription:', subscription);
    } catch (error) {
      console.error('Could not subscribe to push notifications:', error);
    }
  }

  private setupDailyNotifications(): void {
    // Check if service worker is available
    if ('serviceWorker' in navigator && 'Notification' in window) {
      this.requestNotificationPermission().then(granted => {
        if (granted) {
          this.scheduleDailyNotification();
        }
      });
    }
  }

  private scheduleDailyNotification(): void {
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(8, 30, 0, 0); // 8:30 AM

    // If it's already past 8:30 AM today, schedule for tomorrow
    if (now > scheduledTime) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const timeUntilNotification = scheduledTime.getTime() - now.getTime();

    setTimeout(() => {
      this.sendDailyStoryNotification();
      // Schedule the next day's notification
      setInterval(() => {
        this.sendDailyStoryNotification();
      }, 24 * 60 * 60 * 1000); // 24 hours
    }, timeUntilNotification);
  }

  private sendDailyStoryNotification(): void {
    if (Notification.permission === 'granted') {
      const notification = new Notification('Story Stitch - New Tale Awaits!', {
        body: 'A new collaborative story is ready for your contribution. Join your guild and help weave today\'s tale!',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        tag: 'daily-story'
      });

      notification.onclick = () => {
        window.focus();
        window.location.href = '/todays-tale';
      };

      // Auto-close after 10 seconds
      setTimeout(() => {
        notification.close();
      }, 10000);
    }
  }

  showOfflineNotification(): void {
    if (Notification.permission === 'granted') {
      new Notification('Story Stitch - Offline', {
        body: 'You are currently offline. Some features may be limited.',
        icon: '/icons/icon-192x192.png',
        tag: 'offline-status'
      });
    }
  }

  showOnlineNotification(): void {
    if (Notification.permission === 'granted') {
      new Notification('Story Stitch - Back Online', {
        body: 'You are back online! All features are now available.',
        icon: '/icons/icon-192x192.png',
        tag: 'online-status'
      });
    }
  }

  // Test notification (for development)
  sendTestNotification(): void {
    if (Notification.permission === 'granted') {
      new Notification('Story Stitch - Test', {
        body: 'This is a test notification to verify push notifications are working.',
        icon: '/icons/icon-192x192.png',
        tag: 'test-notification'
      });
    }
  }

  getNetworkStatus(): boolean {
    return this.isOnlineSubject.value;
  }
}
