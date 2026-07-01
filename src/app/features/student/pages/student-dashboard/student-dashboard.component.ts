import {Component, computed, inject, OnInit} from "@angular/core";
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
    TranslatePluralPipe
  ],
  providers: [StudentFacade]
})
export class StudentDashboardComponent implements OnInit {
  public readonly sanitizer = inject(DomSanitizer);
  public studentFacade = inject(StudentFacade);
  public name  = computed(() => this.studentFacade.profile()?.creative_name ?? this.studentFacade.profile()?.first_name ?? '');
  public DOTS_SVG = this.sanitizer.bypassSecurityTrustHtml(DOTS_SVG);

  constructor() {
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
}
