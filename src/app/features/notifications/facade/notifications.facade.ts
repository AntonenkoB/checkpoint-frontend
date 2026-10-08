import {inject, Injectable} from "@angular/core";
import {NotificationsStore} from "@notifacations/store/notifications.store";
import {ProfileFacade} from "@profile/facade/profile.facade";
import {NavController} from "@ionic/angular";

@Injectable()
export class NotificationsFacade {
  private profileFacade = inject(ProfileFacade);
  private navController = inject(NavController);
  private notificationsStore = inject(NotificationsStore);

  public activeRole = this.profileFacade.activeRole;
  public notifications = this.notificationsStore.notifications
  public isLoading = this.notificationsStore.isLoading;
  public loadingProcessingId = this.notificationsStore.loadingProcessingId;
  public canLoadMoreNotifications = this.notificationsStore.canLoadMoreNotifications;

  public loadNotifications(): void {
    this.notificationsStore.getNotifications({
      role: this.activeRole()!,
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