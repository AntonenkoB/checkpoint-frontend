import {Component, inject, OnInit} from "@angular/core";
import {HeaderSecondaryComponent} from "@shared/components/header-secondary/header-secondary.component";
import {TranslatePipe} from "@shared/pipes/translate-pipe";
import {RecordStudentItemComponent} from "@shared/components/record-student-item/record-student-item.component";
import {CalendarComponent} from "@shared/components/calendar/calendar.component";
import {TimeListComponent} from "@shared/components/time-list/time-list.component";
import {IonButton} from "@ionic/angular/standalone";
import {recordStudentFacade} from "../record-student/record-student.facade";

@Component({
  selector: "cp-record-time",
  templateUrl: "./record-time.component.html",
  styleUrls: ["./record-time.component.scss"],
  providers: [recordStudentFacade],
  imports: [
    HeaderSecondaryComponent,
    TranslatePipe,
    RecordStudentItemComponent,
    CalendarComponent,
    TimeListComponent,
    IonButton
  ]
})
export class RecordTimeComponent implements OnInit {
  public recordStudentFacade = inject(recordStudentFacade);
  constructor() {}

  ngOnInit() {}
}
