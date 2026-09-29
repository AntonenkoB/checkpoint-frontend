import {Component, inject, OnInit, signal} from "@angular/core";
import {form} from "@angular/forms/signals";
import {HeaderSecondaryComponent} from "@shared/components/header-secondary/header-secondary.component";
import {RecordStudentItemComponent} from "@shared/components/record-student-item/record-student-item.component";
import {TranslatePipe} from "@shared/pipes/translate-pipe";
import {LessonsFacade} from "@lessons/facade/lessons.facade";
import {IonButton, IonCheckbox, IonSpinner} from "@ionic/angular/standalone";
import {CustomCheckbox} from "@shared/directives/custom-checkbox";

@Component({
  selector: "cp-lesson-transferring-type",
  templateUrl: "./lesson-transferring-type.component.html",
  styleUrls: ["./lesson-transferring-type.component.scss"],
  imports: [
    HeaderSecondaryComponent,
    RecordStudentItemComponent,
    TranslatePipe,
    IonButton,
    CustomCheckbox,
    IonCheckbox,
    IonSpinner
  ]
})
export class LessonTransferringTypeComponent implements OnInit {
  public lessonsFacade = inject(LessonsFacade);

  public stillDisableSlotModel = signal({
    return_slot: true,
  });

  public stillDisableSlotForm = form(this.stillDisableSlotModel);

  constructor() {}

  ngOnInit() {}
}
