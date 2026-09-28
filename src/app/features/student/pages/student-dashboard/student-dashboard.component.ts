import {Component, computed, DestroyRef, effect, inject, OnInit, signal} from "@angular/core";
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
import {IndividualLessonComponent} from "@shared/components/individual-lesson/individual-lesson.component";
import {SystemBars, SystemBarsStyle} from "@capacitor/core";
import {PlatformService} from "@shared/services/platform.service";

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
  private platformService = inject(PlatformService);

  public name  = computed(() => this.studentFacade.profile()?.creative_name ?? this.studentFacade.profile()?.first_name ?? '');
  public DOTS_SVG = this.sanitizer.bypassSecurityTrustHtml(DOTS_SVG);
  private static readonly REFRESH_INTERVAL_MS = 60_000;
  private static readonly NO_BAR_SCRIM_CLASS = 'cp-no-bar-scrim';
  private refreshSubscription?: Subscription;


  constructor() {
    this.destroyRef.onDestroy(() => this.toggleBarScrim(false));
  }

  public ngOnInit(): void {
    this.studentFacade.getLessons();
    this.studentFacade.loadTeachers();
    this.studentFacade.loadNotificationsUnread();
  }

  public ionViewWillEnter(): void {
    this.refreshSubscription = interval(StudentDashboardComponent.REFRESH_INTERVAL_MS)
      .subscribe(() => this.refreshData());

    this.toggleBarScrim(true);
    this.customChangeSystemBars(true);
  }

  public ionViewWillLeave(): void {
    this.refreshSubscription?.unsubscribe();

    const isDarkClass = document.documentElement.classList.contains('ion-palette-dark');
    this.toggleBarScrim(false);
    this.customChangeSystemBars(isDarkClass);
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

  private toggleBarScrim(disabled: boolean): void {
    document.documentElement.classList.toggle(
      StudentDashboardComponent.NO_BAR_SCRIM_CLASS,
      disabled,
    );
  }

  private customChangeSystemBars(isDark: boolean): void {
    if (this.platformService.isNative && this.platformService.isAndroid) {

      void SystemBars.setStyle({
        style: isDark ? SystemBarsStyle.Dark : SystemBarsStyle.Light,
      });
    }
  }
}
