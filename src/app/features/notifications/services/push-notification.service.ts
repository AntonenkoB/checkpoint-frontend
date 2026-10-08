import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseMessaging, Importance, Visibility } from '@capacitor-firebase/messaging';
import { Capacitor } from '@capacitor/core';
import { NotificationsService } from '@notifacations/services/notifications.service';
import { Observable, catchError, from, map, of, switchMap, tap, timeout } from 'rxjs';
import {Store} from "@ngrx/store";
import {AppState} from "../../../store/app-store";

@Injectable({ providedIn: 'root' })
export class PushNotificationService {
  private router = inject(Router);
  private notificationsService = inject(NotificationsService);
  private store = inject<Store<AppState>>(Store);
  private currentToken = signal('');

  async init(): Promise<void> {
    if (Capacitor.getPlatform() === 'web') return;

    if (Capacitor.getPlatform() === 'android') {
      await this.createDefaultChannel();
    }

    this.registerListeners();
    await this.requestPermissionAndGetToken();
  }

  public deleteToken(): Observable<unknown> {
    return this.resolveCurrentToken().pipe(
      switchMap((token) => token
        ? this.notificationsService.deleteDeviceTokens(token).pipe(
            tap(() => this.currentToken.set('')),
          )
        : of(null)),
      timeout(5000),
      catchError(() => of(null)),
    );
  }

  private resolveCurrentToken(): Observable<string> {
    if (this.currentToken()) return of(this.currentToken());
    if (Capacitor.getPlatform() === 'web') return of('');

    return from(FirebaseMessaging.getToken()).pipe(
      map(({ token }) => token),
      catchError(() => of('')),
    );
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
    const platform = Capacitor.getPlatform();

    this.notificationsService.setDeviceTokens(token, platform).subscribe({
      next: () => this.currentToken.set(token),
      error: () => {},
    });
  }

  private async createDefaultChannel(): Promise<void> {
    try {
      await FirebaseMessaging.createChannel({
        id: 'default',
        name: 'Default',
        importance: Importance.Max,
        visibility: Visibility.Public,
      });
    } catch {}
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