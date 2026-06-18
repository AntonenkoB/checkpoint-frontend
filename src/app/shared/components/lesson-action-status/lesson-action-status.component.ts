import {Component, input, OnInit, output} from "@angular/core";
import {HeaderSecondaryComponent} from "@shared/components/header-secondary/header-secondary.component";
import {IonButton} from "@ionic/angular/standalone";
import {RecordStudentItemComponent} from "@shared/components/record-student-item/record-student-item.component";
import {TranslatePipe} from "@shared/pipes/translate-pipe";
import {IUser} from "@models/user.model";

@Component({
  selector: "cp-lesson-action-status",
  templateUrl: "./lesson-action-status.component.html",
  styleUrls: ["./lesson-action-status.component.scss"],
  imports: [
    HeaderSecondaryComponent,
    IonButton,
    RecordStudentItemComponent,
  ]
})
export class LessonActionStatusComponent implements OnInit {
  public user = input<IUser>();
  public title = input<string>();
  public date = input<string>();
  public bntTitle = input<string>();

  public close = output();
  public confirm = output();
  constructor() {}

  ngOnInit() {}
}
