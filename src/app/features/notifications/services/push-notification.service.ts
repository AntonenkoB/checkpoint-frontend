import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseMessaging } from '@capacitor-firebase/messaging';
import { Capacitor } from '@capacitor/core';
import { NotificationsService } from '@notifacations/services/notifications.service';

@Injectable({ providedIn: 'root' })
export class PushNotificationService {
  private router = inject(Router);
  private notificationsService = inject(NotificationsService);
  private currentToken = signal('');

  async init(): Promise<void> {
    if (Capacitor.getPlatform() !== 'ios') return;

    this.registerListeners();
    await this.requestPermissionAndGetToken();
  }

  public deleteToken(): void {
    this.notificationsService.deleteDeviceTokens(this.currentToken()).subscribe({
      next: () => this.currentToken.set(''),
      error: () => {},
    });
  }

  private async requestPermissionAndGetToken(): Promise<void> {
    const { receive } = await FirebaseMessaging.requestPermissions();
    if (receive !== 'granted') return;

    try {
      const { token } = await FirebaseMessaging.getToken();
      this.sendTokenToBackend(token);
    } catch {}
  }

  private registerListeners(): void {
    FirebaseMessaging.addListener('tokenReceived', (event) => {
      this.sendTokenToBackend(event.token);
    });

    FirebaseMessaging.addListener('notificationReceived', (event) => {
      this.handleForegroundNotification(event.notification);
    });

    FirebaseMessaging.addListener('notificationActionPerformed', (event) => {
      this.handleNotificationTap(event.notification);
    });
  }

  private sendTokenToBackend(token: string): void {
    this.notificationsService.setDeviceTokens(token, 'ios').subscribe({
      next: () => this.currentToken.set(token),
      error: () => {},
    });
  }

  private handleForegroundNotification(notification: any): void {
    // TODO: показати in-app toast/банер
  }

  private handleNotificationTap(notification: any): void {
    const data = notification?.data;

    if (data?.route) {
      void this.router.navigate([data.route]);
      return;
    }
  }

  async clearAllNotifications(): Promise<void> {
    await FirebaseMessaging.removeAllDeliveredNotifications();
  }
}