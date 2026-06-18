import {Component, computed, inject, OnInit} from "@angular/core";
import {HeaderSecondaryComponent} from "@shared/components/header-secondary/header-secondary.component";
import {TranslatePipe} from "@shared/pipes/translate-pipe";
import {LessonsFacade} from "@lessons/facade/lessons.facade";
import {ELessonFlow, ELessonsType} from "@lessons/models/lessons.model";

@Component({
  selector: "cp-lessons-type",
  templateUrl: "./lessons-type.component.html",
  styleUrls: ["./lessons-type.component.scss"],
  imports: [
    HeaderSecondaryComponent,
    TranslatePipe
  ],
  providers: [LessonsFacade]
})
export class LessonsTypeComponent implements OnInit {
  public lessonsFacade = inject(LessonsFacade);
  public eLessonsType = ELessonsType;
  public titleType = computed(() =>
    this.lessonsFacade.currentLessonsFlow() === ELessonFlow.Booking ? 'market.select-session-type' : 'market.select-payment-type')
  constructor() {}

  ngOnInit() {}
}
