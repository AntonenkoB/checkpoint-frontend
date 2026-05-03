import {Component, computed, inject, input, OnInit} from "@angular/core";
import {HeaderSecondaryComponent} from "@shared/components/header-secondary/header-secondary.component";
import {IUser} from "../../../users/models/user.model";
import {ScheduleFacade} from "../../schedule.facade";
import {RecordStudentItemComponent} from "@shared/components/record-student-item/record-student-item.component";
import {TranslatePipe} from "@shared/pipes/translate-pipe";

@Component({
  selector: "cp-transferring-lesson",
  templateUrl: "./transferring-lesson.component.html",
  styleUrls: ["./transferring-lesson.component.scss"],
  imports: [
    HeaderSecondaryComponent,
    RecordStudentItemComponent,
    TranslatePipe
  ],
  providers: [ScheduleFacade]
})
export class TransferringLessonComponent implements OnInit {
  public user = input<IUser | null>();
  public scheduleFacade = inject(ScheduleFacade);
  public student = computed(() => this.scheduleFacade.studentsList().find(student => student.id === 4));

  ngOnInit() {}
}
