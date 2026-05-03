import {Component, computed, inject} from "@angular/core";
import {HeaderSecondaryComponent} from "@shared/components/header-secondary/header-secondary.component";
import {RecordStudentItemComponent} from "@shared/components/record-student-item/record-student-item.component";
import {IonButton} from "@ionic/angular/standalone";
import {ScheduleFacade} from "../../schedule.facade";
import {TranslatePipe} from "@shared/pipes/translate-pipe";

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
  providers: [ScheduleFacade]
})
export class LessonCanceledComponent {
  public scheduleFacade = inject(ScheduleFacade);
  public student = computed(() => this.scheduleFacade.studentsList().find(student => student.id === 4));
}
