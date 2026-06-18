import {Component, computed, input, model, OnInit, output} from "@angular/core";
import {AvatarComponent} from "@shared/components/avatar/avatar.component";
import {IUser} from "@models/user.model";

@Component({
  selector: "cp-record-student-item",
  templateUrl: "./record-student-item.component.html",
  styleUrls: ["./record-student-item.component.scss"],
  imports: [
    AvatarComponent
  ]
})
export class RecordStudentItemComponent implements OnInit {
  public student = model<IUser>();
  public withAmountLesson = input(true);
  public select = output<IUser>()
  public lessonsAmount = computed(() =>
    this.student()?.purchases?.reduce((sum, item) => sum + item.lessons_remaining, 0))
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
