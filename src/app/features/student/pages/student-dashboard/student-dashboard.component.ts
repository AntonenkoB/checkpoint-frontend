import {AfterViewInit, Component, computed, effect, inject, OnInit} from "@angular/core";
import {IonButton, IonFab, IonFabButton, IonFabList, IonIcon} from "@ionic/angular/standalone";
import {TranslatePipe} from "@shared/pipes/translate-pipe";
import {UserItemComponent} from "@shared/components/user-item/user-item.component";
import {DomSanitizer} from "@angular/platform-browser";
import {DOTS_SVG, PLUS_SVG} from "@models/svg.models";
import {StudentFacade} from "@student/facade/student.facade";
import {ILesson} from "@models/lesson.model";
import {AvatarComponent} from "@shared/components/avatar/avatar.component";
import {LessonDateTimePipe} from "@shared/pipes/lesson-date-time-pipe";

@Component({
  selector: "cp-student-dashboard",
  templateUrl: "./student-dashboard.component.html",
  styleUrls: ["./student-dashboard.component.scss"],
  imports: [
    IonButton,
    TranslatePipe,
    UserItemComponent,
    AvatarComponent,
    LessonDateTimePipe,
    IonFab,
    IonFabButton,
    IonFabList
  ],
  providers: [StudentFacade]
})
export class StudentDashboardComponent implements OnInit {
  public readonly sanitizer = inject(DomSanitizer);
  public studentFacade = inject(StudentFacade);
  public name  = computed(() => this.studentFacade.profile()?.creative_name ?? this.studentFacade.profile()?.first_name ?? '');

  public DOTS_SVG = this.sanitizer.bypassSecurityTrustHtml(DOTS_SVG);
  public PLUS_SVG = this.sanitizer.bypassSecurityTrustHtml(PLUS_SVG);


  constructor() {
    effect(() => {
      if (this.studentFacade.groupFutureLessons()) {
        this.scrollToCurrentWeek();
      }
    });
  }

  ngOnInit() {
    this.studentFacade.getLessons();
    this.studentFacade.loadTeachers();
  }

  public checkActions(lesson: ILesson): boolean {
    const twentyFourHoursInMs = 24 * 60 * 60 * 1000;
    const minAllowedTime = Date.now() + twentyFourHoursInMs;
    const targetDateTime = new Date(`${lesson.date}T${lesson.time.from}:00`);

    return targetDateTime.getTime() > minAllowedTime;
  }

  private scrollToCurrentWeek(): void {
    setTimeout(() => {
      const element = document.getElementById('current-week-scroll-target');
      const scrollContainer = document.querySelector('.lessons-wrap');

      if (element && scrollContainer) {
        element.scrollIntoView({
          block: 'start',
        });
      }
    }, 0)
  }
}
