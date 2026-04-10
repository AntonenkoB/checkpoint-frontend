import {effect, inject, Injectable, Signal} from "@angular/core";
import {Store} from "@ngrx/store";
import {AppState} from "../../../../store/app-store";
import {EUserPages, EUserRole, IUser} from "../../models/user.model";
import {selectAllUsers, selectAllUsersPagination, selectProfile, selectUserLoading} from "../../store/selectors";
import {UserActions} from "../../store/actions";
import {RouterActions} from "../../../../store/router/actions";
import {EAppPages} from "@models/router.model";
import {IPagination} from "@models/api.models";

@Injectable()
export class UserListFacade {
  private store = inject<Store<AppState>>(Store);
  public userList: Signal<IUser[]> = this.store.selectSignal(selectAllUsers);
  public profile: Signal<IUser | null> = this.store.selectSignal(selectProfile);
  public userListPagination: Signal<IPagination> = this.store.selectSignal(selectAllUsersPagination);
  public userListLoading: Signal<boolean> = this.store.selectSignal(selectUserLoading);

  constructor() {
    this.store.dispatch(UserActions.allUsers({role: EUserRole.Student}))
  }

  public getUserList(role: EUserRole, page: number = 1): void {
    this.store.dispatch(UserActions.allUsers({role, page}))
  }

  public create(role: EUserRole): void {
    this.store.dispatch(RouterActions.navigate({path: [EAppPages.Users, EUserPages.Create], extras: {queryParams: {role}}}))
  }

  public goToUser(id: number, role: EUserRole): void {
    this.store.dispatch(RouterActions.navigate({path: [EAppPages.Users, EUserPages.User, id], extras: {queryParams: {role}}}))
  }

  public goToProfile(): void {
    this.store.dispatch(RouterActions.navigate({path: [EAppPages.Users, EUserPages.Profile]}))
  }
}