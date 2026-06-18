import {Component, computed, inject, OnInit} from "@angular/core";
import {HeaderSecondaryComponent} from "@shared/components/header-secondary/header-secondary.component";
import {RecordStudentItemComponent} from "@shared/components/record-student-item/record-student-item.component";
import {TranslatePipe} from "@shared/pipes/translate-pipe";
import {ScheduleFacade} from "@schedule/facade/schedule.facade";
import {LessonsFacade} from "@lessons/facade/lessons.facade";
import {UserItemComponent} from "@shared/components/user-item/user-item.component";
import {ELessonFlow} from "@lessons/models/lessons.model";

@Component({
  selector: "cp-select-teacher",
  templateUrl: "./select-teacher.component.html",
  styleUrls: ["./select-teacher.component.scss"],
  imports: [
    HeaderSecondaryComponent,
    TranslatePipe,
    UserItemComponent,
    RecordStudentItemComponent
  ],
  providers: [ScheduleFacade]
})
export class SelectTeacherComponent implements OnInit {
  public lessonsFacade = inject(LessonsFacade);
  public titleHeader = computed(() => {
    return this.lessonsFacade.currentLessonsFlow() === ELessonFlow.Booking ? 'record.select-teacher-title' : 'market.select-teacher-to-buy'
  })

  constructor() {}

  ngOnInit() {}
}
