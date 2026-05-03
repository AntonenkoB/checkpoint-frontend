import {Component, input, OnInit, output} from "@angular/core";
import {AvatarComponent} from "@shared/components/avatar/avatar.component";
import {IUser} from "../../../features/users/models/user.model";

@Component({
  selector: "cp-record-student-item",
  templateUrl: "./record-student-item.component.html",
  styleUrls: ["./record-student-item.component.scss"],
  imports: [
    AvatarComponent
  ]
})
export class RecordStudentItemComponent implements OnInit {
  public student = input<IUser>();
  public withAmountLesson = input(true);
  public select = output<IUser>()
  constructor() {}

  ngOnInit() {}

  public getCreativeName(): string {
    return this.student()?.creative_name ?? this.student()?.first_name ?? ''
  }

  public getName(): string {
    return this.student()?.creative_name ? `${this.student()?.first_name ?? ''} ${this.student()?.last_name ?? ''}` : this.student()?.last_name ?? ' '
  }

  public selectStudent(): void {
    this.select.emit(this.student() as IUser);
  }
}
