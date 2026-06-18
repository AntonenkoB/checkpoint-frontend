import {Component, computed, inject} from "@angular/core";
import {HeaderSecondaryComponent} from "@shared/components/header-secondary/header-secondary.component";
import {RecordStudentItemComponent} from "@shared/components/record-student-item/record-student-item.component";
import {IonButton} from "@ionic/angular/standalone";
import {TranslatePipe} from "@shared/pipes/translate-pipe";
import {LessonsFacade} from "@lessons/facade/lessons.facade";
import {TRANSFERRED_LESSON_SVG} from "@models/svg.models";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: "cp-lesson-canceled",
  templateUrl: "./lesson-canceled.component.html",
  styleUrls: ["./lesson-canceled.component.scss"],
  imports: [
    HeaderSecondaryComponent,
    RecordStudentItemComponent,
    IonButton,
    TranslatePipe
  ],
  providers: [LessonsFacade]
})
export class LessonCanceledComponent {
  public lessonsFacade = inject(LessonsFacade);
  public readonly sanitizer = inject(DomSanitizer);
  public TRANSFERRED_LESSON_SVG = this.sanitizer.bypassSecurityTrustHtml(TRANSFERRED_LESSON_SVG);
}
