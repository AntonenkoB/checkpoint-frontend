import {Component, computed, effect, inject, OnInit, signal} from "@angular/core";
import {HeaderSecondaryComponent} from "@shared/components/header-secondary/header-secondary.component";
import {TranslatePipe} from "@shared/pipes/translate-pipe";
import {recordStudentFacade} from "./record-student.facade";
import {RecordStudentItemComponent} from "@shared/components/record-student-item/record-student-item.component";
import {ScheduleFacade} from "@schedule/schedule.facade";

@Component({
  selector: "cp-record-student",
  templateUrl: "./record-student.component.html",
  styleUrls: ["./record-student.component.scss"],
  imports: [
    HeaderSecondaryComponent,
    TranslatePipe,
    RecordStudentItemComponent
  ],
  providers: [recordStudentFacade]
})
export class RecordStudentComponent implements OnInit {
  public readonly studentFacade = inject(ScheduleFacade);
  public studentsList = signal(this.studentFacade.studentsList());

  constructor() {
    effect(() => {
      this.studentsList.set(this.studentFacade.studentsList());
    });
  }

  ngOnInit() {
  }
}
