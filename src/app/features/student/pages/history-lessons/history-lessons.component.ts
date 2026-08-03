import {Component, inject, OnInit} from "@angular/core";
import {HeaderSecondaryComponent} from "@shared/components/header-secondary/header-secondary.component";
import {TranslatePipe} from "@shared/pipes/translate-pipe";
import {IonContent} from "@ionic/angular/standalone";
import {StudentFacade} from "@student/facade/student.facade";
import {LessonDateTimePipe} from "@shared/pipes/lesson-date-time-pipe";
import {EmptyStateComponent} from "@shared/components/empty-state/empty-state.component";
import {IndividualLessonComponent} from "@shared/components/individual-lesson/individual-lesson.component";
import {UserItemReadComponent} from "@shared/components/user-item-read/user-item-read.component";

@Component({
  selector: "cp-history-lessons",
  templateUrl: "./history-lessons.component.html",
  styleUrls: ["./history-lessons.component.scss"],
  imports: [
    HeaderSecondaryComponent,
    TranslatePipe,
    IonContent,
    LessonDateTimePipe,
    EmptyStateComponent,
    IndividualLessonComponent,
    UserItemReadComponent
  ],
  providers: [StudentFacade]
})
export class HistoryLessonsComponent implements OnInit {
  public studentFacade = inject(StudentFacade);

  constructor() {}

  ngOnInit() {
    this.studentFacade.getLessons();
  }
}
