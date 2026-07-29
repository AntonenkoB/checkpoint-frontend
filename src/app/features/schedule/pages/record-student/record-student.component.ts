import {Component, inject, OnInit, signal} from "@angular/core";
import {HeaderSecondaryComponent} from "@shared/components/header-secondary/header-secondary.component";
import {TranslatePipe} from "@shared/pipes/translate-pipe";
import {RecordStudentFacade} from "../../facade/record-student.facade";
import {ScheduleFacade} from "@schedule/facade/schedule.facade";
import {UserItemComponent} from "@shared/components/user-item/user-item.component";
import {IonButton, IonContent, IonInput} from "@ionic/angular/standalone";
import {IUser} from "@models/user.model";
import {EmptyStateComponent} from "@shared/components/empty-state/empty-state.component";

@Component({
  selector: "cp-record-student",
  templateUrl: "./record-student.component.html",
  styleUrls: ["./record-student.component.scss"],
  imports: [
    HeaderSecondaryComponent,
    TranslatePipe,
    UserItemComponent,
    IonButton,
    IonContent,
    IonInput,
    EmptyStateComponent
  ],
  providers: [RecordStudentFacade, ScheduleFacade]
})
export class RecordStudentComponent implements OnInit {
  public readonly recordStudentFacade = inject(RecordStudentFacade);
  public activeStudent = signal(0);
  public searchUser = signal('');


  constructor() {
  }

  ngOnInit() {
    this.recordStudentFacade.getStudents('');
  }

  ionViewWillEnter(): void {
    this.recordStudentFacade.getStudents('');
  }

  public selectStudent(id: number, student: IUser): void {
    this.activeStudent.set(id);
    this.recordStudentFacade.selectedStudent(student);
  }
}
