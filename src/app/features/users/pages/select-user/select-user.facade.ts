import {inject, Injectable, Signal} from "@angular/core";
import {IUser} from "../../models/user.model";
import {Store} from "@ngrx/store";
import {AppState} from "../../../../store/app-store";
import {selectAllTeachers} from "../../store/selectors";
import {UserActions} from "../../store/actions";

@Injectable()
export class SelectUserFacade {
  private store = inject<Store<AppState>>(Store);
  public teachersList: Signal<IUser[]> = this.store.selectSignal(selectAllTeachers);

  constructor() {
    this.store.dispatch(UserActions.allTeachers({}));
  }
}
