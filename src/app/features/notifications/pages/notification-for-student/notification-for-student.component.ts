import {Component, computed, inject, input, output} from "@angular/core";
import {UserItemReadComponent} from "@shared/components/user-item-read/user-item-read.component";
import {DomSanitizer} from "@angular/platform-browser";
import {IonButton, IonSpinner} from "@ionic/angular/standalone";
import {ENotificationAction, INotification} from "../../models/notifications.model";
import {LessonDateTimePipe} from "@shared/pipes/lesson-date-time-pipe";
import {getNotificationAction} from "@shared/utils/notifications.utils";
import {TranslatePipe} from "@shared/pipes/translate-pipe";
import {LessonPreviousDateTimePipe} from "@shared/pipes/lesson-previous-date-time-pipe";
import {IndividualLessonComponent} from "@shared/components/individual-lesson/individual-lesson.component";

@Component({
  selector: "cp-notification-for-student",
  imports: [
    UserItemReadComponent,
    IonButton,
    LessonDateTimePipe,
    TranslatePipe,
    LessonPreviousDateTimePipe,
    IndividualLessonComponent,
    IonSpinner
  ],
  templateUrl: "./notification-for-student.component.html",
  styleUrl: "./notification-for-student.component.scss",
})
export class NotificationForStudentComponent {
  public notification = input<INotification>();
  public isLoading = input<boolean>(false);
  public loadingProcessingId = input<number>(0);
  public read = output<number>();
  public confirm = output<number>();
  public reject = output<number>();

  public readonly sanitizer = inject(DomSanitizer);
  public action = computed(() => getNotificationAction(this.notification()?.type!));
  public notificationTitle = computed(() =>
    `notification.type.${this.notification()?.type}`
  );
  public eNotificationAction = ENotificationAction;
}
