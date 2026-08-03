import {Component, DestroyRef, inject, OnInit} from "@angular/core";
import {NotificationsFacade} from "@notifacations/facade/notifications.facade";
import {HeaderSecondaryComponent} from "@shared/components/header-secondary/header-secondary.component";
import {TranslatePipe} from "@shared/pipes/translate-pipe";
import {NotificationItemComponent} from "@notifacations/pages/notification-item/notification-item.component";
import {interval, Subscription} from "rxjs";
import {IonContent, IonInfiniteScroll, IonInfiniteScrollContent, IonRefresher, IonRefresherContent} from "@ionic/angular/standalone";
import {InfiniteScrollCustomEvent} from "@ionic/angular";

@Component({
  selector: "cp-notifications",
  templateUrl: "./notifications.component.html",
  styleUrl: "./notifications.component.scss",
  providers: [NotificationsFacade],
  imports: [
    HeaderSecondaryComponent,
    TranslatePipe,
    NotificationItemComponent,
    IonRefresher,
    IonRefresherContent,
    IonContent,
    IonInfiniteScroll,
    IonInfiniteScrollContent
  ]
})
export class NotificationsComponent implements OnInit {
  public notificationsFacade = inject(NotificationsFacade)
  private static readonly REFRESH_INTERVAL_MS = 60_000;
  private refreshSubscription?: Subscription;


  public ngOnInit(): void {
    this.notificationsFacade.loadNotifications();
  }

  public ionViewWillEnter(): void {
    this.refreshSubscription = interval(NotificationsComponent.REFRESH_INTERVAL_MS)
      .subscribe(() => this.notificationsFacade.autoRefreshNotifications());
  }

  public ionViewWillLeave(): void {
    this.refreshSubscription?.unsubscribe();
  }

  public async onInfiniteLoadNotifications(event: InfiniteScrollCustomEvent): Promise<void> {
    this.notificationsFacade.loadMoreNotifications();
    await event.target.complete();
  }

  // handleRefresh(event: RefresherCustomEvent) {
  //   this.notificationsFacade.loadNotifications();
  //
  //   if (this.notificationsFacade.notificationsLoader()) {
  //     void event.target.complete();
  //   }
  //
  //   setTimeout(() => void event.target.complete(), 1500);
  // }
}
