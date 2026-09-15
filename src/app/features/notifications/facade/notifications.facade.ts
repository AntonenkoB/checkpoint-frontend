import {inject, Injectable} from "@angular/core";
import {Store} from "@ngrx/store";
import {AppState} from "@capacitor/app";
import {ActivatedRoute} from "@angular/router";
import {NotificationsStore} from "@notifacations/store/notifications.store";
import {ProfileFacade} from "@profile/facade/profile.facade";
import {NavController} from "@ionic/angular";

@Injectable()
export class NotificationsFacade {
  private store = inject<Store<AppState>>(Store);
  private route = inject(ActivatedRoute);
  private profileFacade = inject(ProfileFacade);
  private navController = inject(NavController);
  private notificationsStore = inject(NotificationsStore);
  private activeRole = this.profileFacade.activeRole();
  public notifications = this.notificationsStore.notifications
  public notificationsLoader = this.notificationsStore.isLoading;
  public canLoadMoreNotifications = this.notificationsStore.canLoadMoreNotifications;

  public loadNotifications(): void {
    if (!this.activeRole) return;

    this.notificationsStore.getNotifications({
      role: this.activeRole,
    });
  }

  public autoRefreshNotifications(): void {
    const meta = this.notificationsStore.notificationsMeta();
    if (meta && meta.currentPage > 1) return;

    this.loadNotifications();
  }

  public loadMoreNotifications(): void {
    this.notificationsStore.loadMoreNotifications();
  }

  public readNotification(id: number): void {
    this.notificationsStore.readNotification(id);
  }

  public toBackPage(): void {
    this.navController.back();
  }
}