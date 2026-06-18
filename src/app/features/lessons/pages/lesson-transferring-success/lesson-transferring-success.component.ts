import {Component, inject, OnInit} from "@angular/core";
import {LessonsFacade} from "@lessons/facade/lessons.facade";
import {DomSanitizer} from "@angular/platform-browser";
import {TRANSFERRED_LESSON_SVG} from "@models/svg.models";
import {HeaderSecondaryComponent} from "@shared/components/header-secondary/header-secondary.component";
import {IonButton} from "@ionic/angular/standalone";
import {RecordStudentItemComponent} from "@shared/components/record-student-item/record-student-item.component";
import {TranslatePipe} from "@shared/pipes/translate-pipe";

@Component({
  selector: "cp-lesson-transferring-success",
  templateUrl: "./lesson-transferring-success.component.html",
  styleUrls: ["./lesson-transferring-success.component.scss"],
  imports: [
    HeaderSecondaryComponent,
    IonButton,
    RecordStudentItemComponent,
    TranslatePipe
  ]
})
export class LessonTransferringSuccessComponent implements OnInit {
  public lessonsFacade = inject(LessonsFacade);
  public readonly sanitizer = inject(DomSanitizer);
  public TRANSFERRED_LESSON_SVG = this.sanitizer.bypassSecurityTrustHtml(TRANSFERRED_LESSON_SVG);

  constructor() {}

  ngOnInit() {}
}
