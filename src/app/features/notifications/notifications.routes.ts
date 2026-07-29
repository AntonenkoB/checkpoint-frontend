import {Routes} from '@angular/router';
import {ENotificationPage} from "@notifacations/models/notifications.model";

export const routesNotifications: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/notifications/notifications.component').then((m) => m.NotificationsComponent),
  },
  {
    path: '',
    redirectTo:  '',
    pathMatch: 'full',
  },
];

export default routesNotifications;