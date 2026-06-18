import {Component, inject, OnInit} from "@angular/core";
import {HeaderSecondaryComponent} from "@shared/components/header-secondary/header-secondary.component";
import {RecordStudentItemComponent} from "@shared/components/record-student-item/record-student-item.component";
import {TranslatePipe} from "@shared/pipes/translate-pipe";
import {LessonsFacade} from "@lessons/facade/lessons.facade";
import {IonButton} from "@ionic/angular/standalone";

@Component({
  selector: "cp-lesson-transferring-type",
  templateUrl: "./lesson-transferring-type.component.html",
  styleUrls: ["./lesson-transferring-type.component.scss"],
  imports: [
    HeaderSecondaryComponent,
    RecordStudentItemComponent,
    TranslatePipe,
    IonButton
  ]
})
export class LessonTransferringTypeComponent implements OnInit {
  public lessonsFacade = inject(LessonsFacade);

  constructor() {}

  ngOnInit() {}
}
