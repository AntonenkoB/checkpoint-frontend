import {inject, Injectable, Signal} from "@angular/core";
import {IUser} from "@models/user.model";
import {UsersStore} from "@users/store/users.store";

@Injectable()
export class SelectUserFacade {
  private usersStore = inject(UsersStore);
  public teachersList: Signal<IUser[]> = this.usersStore.teachersList;

  constructor() {
    this.usersStore.loadTeachers();
  }
}
