import {Component, inject, OnInit, signal, ViewChild} from "@angular/core";
import {form} from "@angular/forms/signals";
import {HeaderSecondaryComponent} from "@shared/components/header-secondary/header-secondary.component";
import {RecordStudentItemComponent} from "@shared/components/record-student-item/record-student-item.component";
import {TranslatePipe} from "@shared/pipes/translate-pipe";
import {LessonsFacade} from "@lessons/facade/lessons.facade";
import {IonButton, IonCheckbox, IonModal, IonSpinner} from "@ionic/angular/standalone";
import {CustomCheckbox} from "@shared/directives/custom-checkbox";
import {ConfirmModalComponent} from "@shared/components/confirm-modal/confirm-modal.component";
import {Platform} from "@ionic/angular";

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
    IonSpinner,
    ConfirmModalComponent,
    IonModal
  ]
})
export class LessonTransferringTypeComponent implements OnInit {
  @ViewChild('cancelLessonModal') cancelLessonModal!: IonModal;

  public lessonsFacade = inject(LessonsFacade);
  private platform = inject(Platform);

  public stillDisableSlotModel = signal({
    return_slot: true,
  });

  public stillDisableSlotForm = form(this.stillDisableSlotModel);
  public modalBreakpoints = this.platform.is('desktop') ? undefined : [0, 0.5, 1];
  public initialBreakpoint = this.platform.is('desktop') ? undefined : 0.5;

  constructor() {}

  ngOnInit() {}

  public ionViewWillLeave(): void {
    void this.cancelLessonModal?.dismiss();
  }

  public cancelLessonModalCansel(): void {
    void this.cancelLessonModal.dismiss();
  }

  public cancelLessonModalConfirm(): void {
    this.lessonsFacade.cancelLesson(!this.stillDisableSlotForm.return_slot().value())
  }
}
