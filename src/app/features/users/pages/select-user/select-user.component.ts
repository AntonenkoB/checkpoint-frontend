import {Component, effect, inject, input, output, signal} from "@angular/core";
import {HeaderSecondaryComponent} from "@shared/components/header-secondary/header-secondary.component";
import {TranslatePipe} from "@shared/pipes/translate-pipe";
import {UserItemComponent} from "@shared/components/user-item/user-item.component";
import {SelectUserFacade} from "./select-user.facade";
import {IonButton} from "@ionic/angular/standalone";
import {IUser} from "../../models/user.model";

@Component({
  selector: "cp-select-teacher",
  templateUrl: "./select-user.component.html",
  styleUrls: ["./select-user.component.scss"],
  imports: [
    HeaderSecondaryComponent,
    TranslatePipe,
    UserItemComponent,
    IonButton
  ],
  providers: [SelectUserFacade]
})
export class SelectUserComponent {
  public readonly selectTeacherFacade = inject(SelectUserFacade);
  public choseTeachers = input<IUser[]>([]);
  public selectedTeacher = signal<number[]>([]);
  public close = output();
  public save = output<number[]>();

  constructor() {
    effect(() => {
      this.selectedTeacher.set(this.choseTeachers().map(teacher => teacher.id));
    });
  }

  public toggleTeacher(id: number): void {
    this.selectedTeacher.update(ids =>
      ids.includes(id)
        ? ids.filter(i => i !== id)
        : [...ids, id]
    );
  }
}
