import {Component, computed, DestroyRef, inject, OnInit} from "@angular/core";
import {IonButton} from "@ionic/angular/standalone";
import {TranslatePipe} from "@shared/pipes/translate-pipe";
import {DomSanitizer} from "@angular/platform-browser";
import {DOTS_SVG} from "@models/svg.models";
import {StudentFacade} from "@student/facade/student.facade";
import {ILesson} from "@models/lesson.model";
import {AvatarComponent} from "@shared/components/avatar/avatar.component";
import {LessonDateTimePipe} from "@shared/pipes/lesson-date-time-pipe";
import {UserItemReadComponent} from "@shared/components/user-item-read/user-item-read.component";
import {TranslatePluralPipe} from "@shared/pipes/translate-plural.pipe";
import {
  NotificationForStudentComponent
} from "@notifacations/pages/notification-for-student/notification-for-student.component";
import {interval, Subscription} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {IndividualLessonComponent} from "@shared/components/individual-lesson/individual-lesson.component";

@Component({
  selector: "cp-student-dashboard",
  templateUrl: "./student-dashboard.component.html",
  styleUrls: ["./student-dashboard.component.scss"],
  imports: [
    IonButton,
    TranslatePipe,
    AvatarComponent,
    LessonDateTimePipe,
    UserItemReadComponent,
    TranslatePluralPipe,
    NotificationForStudentComponent,
    IndividualLessonComponent
  ],
  providers: [StudentFacade]
})
export class StudentDashboardComponent implements OnInit {
  public readonly sanitizer = inject(DomSanitizer);
  public studentFacade = inject(StudentFacade);
  private readonly destroyRef = inject(DestroyRef);

  public name  = computed(() => this.studentFacade.profile()?.creative_name ?? this.studentFacade.profile()?.first_name ?? '');
  public DOTS_SVG = this.sanitizer.bypassSecurityTrustHtml(DOTS_SVG);
  private static readonly REFRESH_INTERVAL_MS = 60_000;
  private refreshSubscription?: Subscription;


  constructor() {
  }

  public ngOnInit(): void {
    this.studentFacade.getLessons();
    this.studentFacade.loadTeachers();
    this.studentFacade.loadNotificationsUnread();
  }

  public ionViewWillEnter(): void {
    this.refreshSubscription = interval(StudentDashboardComponent.REFRESH_INTERVAL_MS)
      .subscribe(() => this.refreshData());
  }

  public ionViewWillLeave(): void {
    this.refreshSubscription?.unsubscribe();
  }

  private refreshData(): void {
    this.studentFacade.getLessons();
    this.studentFacade.loadNotificationsUnread();
  }

  public checkActions(lesson: ILesson): boolean {
    const twentyFourHoursInMs = 24 * 60 * 60 * 1000;
    const minAllowedTime = Date.now() + twentyFourHoursInMs;
    const targetDateTime = new Date(`${lesson.date}T${lesson.time.from}:00`);

    return targetDateTime.getTime() > minAllowedTime;
  }
}
