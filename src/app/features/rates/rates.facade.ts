import {inject, Injectable, Signal} from "@angular/core";
import {Store} from "@ngrx/store";
import {EAppPages} from "@models/router.model";
import {AppState} from "@capacitor/app";
import {EHeaderMenu, ERateTabs, EUserPages, EUserRole, IUser} from "../users/models/user.model";
import {selectAllUsers, selectProfile} from "../users/store/selectors";
import {UserActions} from "../users/store/actions";
import {RouterActions} from "../../store/router/actions";

@Injectable()
export class RatesFacade {
  private store = inject<Store<AppState>>(Store);
  public profile: Signal<IUser | null> = this.store.selectSignal(selectProfile);
  public studentsList = this.store.selectSignal(selectAllUsers);

  constructor() {
    this.store.dispatch(UserActions.allUsers({role: EUserRole.Student, page: 1}));
  }

  public goToRateList(): void {
    this.store.dispatch(RouterActions.goTo({path: [EAppPages.Users, EUserPages.ListUsers], extras: {queryParams: {tab: EHeaderMenu.Teacher, ratesTab: ERateTabs.Price}}}));
  }

  public goToSalaryList(): void {
    this.store.dispatch(RouterActions.goTo({path: [EAppPages.Users, EUserPages.ListUsers], extras: {queryParams: {tab: EHeaderMenu.Teacher, ratesTab: ERateTabs.Salary}}}));
  }
}