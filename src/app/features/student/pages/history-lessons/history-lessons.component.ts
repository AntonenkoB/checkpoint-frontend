import {Component, inject, OnInit} from "@angular/core";
import {HeaderSecondaryComponent} from "@shared/components/header-secondary/header-secondary.component";
import {TranslatePipe} from "@shared/pipes/translate-pipe";
import {IonContent} from "@ionic/angular/standalone";
import {StudentFacade} from "@student/facade/student.facade";
import {LessonDateTimePipe} from "@shared/pipes/lesson-date-time-pipe";

@Component({
  selector: "cp-history-lessons",
  templateUrl: "./history-lessons.component.html",
  styleUrls: ["./history-lessons.component.scss"],
  imports: [
    HeaderSecondaryComponent,
    TranslatePipe,
    IonContent,
    LessonDateTimePipe
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
