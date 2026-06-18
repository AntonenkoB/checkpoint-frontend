import {Component, inject, OnInit} from "@angular/core";
import {HeaderSecondaryComponent} from "@shared/components/header-secondary/header-secondary.component";
import {IonButton} from "@ionic/angular/standalone";
import {RecordStudentItemComponent} from "@shared/components/record-student-item/record-student-item.component";
import {TranslatePipe} from "@shared/pipes/translate-pipe";
import {LessonsFacade} from "@lessons/facade/lessons.facade";
import {DomSanitizer} from "@angular/platform-browser";
import {TRANSFERRED_LESSON_SVG} from "@models/svg.models";

@Component({
  selector: "cp-lessons-success",
  templateUrl: "./lessons-success.component.html",
  styleUrls: ["./lessons-success.component.scss"],
  imports: [
    HeaderSecondaryComponent,
    IonButton,
    RecordStudentItemComponent,
    TranslatePipe
  ],
})
export class LessonsSuccessComponent implements OnInit {
  public lessonsFacade = inject(LessonsFacade);
  public readonly sanitizer = inject(DomSanitizer);
  public TRANSFERRED_LESSON_SVG = this.sanitizer.bypassSecurityTrustHtml(TRANSFERRED_LESSON_SVG);

  constructor() {
  }
  ngOnInit() {
  }
}
