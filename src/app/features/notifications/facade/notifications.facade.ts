import {inject, Injectable} from "@angular/core";
import {Store} from "@ngrx/store";
import {AppState} from "@capacitor/app";
import {ActivatedRoute} from "@angular/router";
import {NotificationsStore} from "@notifacations/store/notifications.store";
import {RouterActions} from "../../../store/router/actions";
import {EAppPages} from "@models/router.model";
import {EUserPages} from "@users/models/user.model";
import {ProfileFacade} from "@profile/facade/profile.facade";
import {ENotificationStatus} from "@notifacations/models/notifications.model";

@Injectable()
export class NotificationsFacade {
  private store = inject<Store<AppState>>(Store);
  private route = inject(ActivatedRoute);
  private profileFacade = inject(ProfileFacade);
  private notificationsStore = inject(NotificationsStore);
  private activeRole = this.profileFacade.activeRole();
  public notifications = this.notificationsStore.notifications
  public notificationsLoader = this.notificationsStore.isLoading;
  public canLoadMoreNotifications = this.notificationsStore.canLoadMoreNotifications;

  public loadNotifications(): void {
    if (!this.activeRole) return;

    this.notificationsStore.getNotifications({
      role: this.activeRole,
      status: this.profileFacade.isStudent() ? ENotificationStatus.Read : undefined,
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
    this.store.dispatch(RouterActions.goTo({path: [EAppPages.Users, EUserPages.ListUsers], back: true}))
  }
}