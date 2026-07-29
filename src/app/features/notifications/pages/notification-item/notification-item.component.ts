import {Component, computed, input, output} from "@angular/core";
import {LessonDateTimePipe} from "@shared/pipes/lesson-date-time-pipe";
import {UserItemReadComponent} from "@shared/components/user-item-read/user-item-read.component";
import {ENotificationStatus, INotification} from "@notifacations/models/notifications.model";
import {getNotificationAction} from "@shared/utils/notifications.utils";
import {TranslatePipe} from "@shared/pipes/translate-pipe";
import {IonButton} from "@ionic/angular/standalone";
import {LessonPreviousDateTimePipe} from "@shared/pipes/lesson-previous-date-time-pipe";

@Component({
  selector: "cp-notification-item",
  imports: [
    LessonDateTimePipe,
    UserItemReadComponent,
    TranslatePipe,
    IonButton,
    LessonPreviousDateTimePipe
  ],
  templateUrl: "./notification-item.component.html",
  styleUrl: "./notification-item.component.scss",
})
export class NotificationItemComponent {
  public notification = input<INotification>();
  public readNotification = output<number>();

  public action = computed(() => getNotificationAction(this.notification()?.type!));
  public notificationTitle = computed(() =>
    `notification.type.${this.notification()?.type}`
  );
  protected readonly eNotificationStatus = ENotificationStatus;
}
