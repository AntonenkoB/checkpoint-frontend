import {computed, effect, inject, Injectable, Signal} from "@angular/core";
import {Store} from "@ngrx/store";
import {AppState} from "../../../../store/app-store";
import {EUserPages, EUserRole, IUser, IUserUpdate} from "../../models/user.model";
import {UserActions} from "../../store/actions";
import {ActivatedRoute} from "@angular/router";
import {toSignal} from "@angular/core/rxjs-interop";
import {selectAllTeachers, selectUser, selectUserLoading} from "../../store/selectors";
import {RouterActions} from "../../../../store/router/actions";
import {EAppPages, ERoutParams} from "@models/router.model";
import { selectRouteParams } from "src/app/store/router/selectors";

@Injectable()
export class UserFacade {
  private store = inject<Store<AppState>>(Store);
  private route = inject(ActivatedRoute);
  private queryParams = toSignal(this.route.queryParams, {initialValue: {role: EUserRole.Student}});
  public roleCreate = computed(() => this.queryParams()['role']);
  public selectRouteParams = this.store.selectSignal(selectRouteParams);
  public user = this.store.selectSignal(selectUser);
  public userLoading = this.store.selectSignal(selectUserLoading);
  public teachersList: Signal<IUser[]> = this.store.selectSignal(selectAllTeachers);

  constructor() {
    effect(() => {
      const id = this.selectRouteParams()[ERoutParams.UserId];
      if (id) {
        this.store.dispatch(UserActions.getUser({userId: +id}))
      }
    })
  }

  public createUser(user: IUserUpdate): void {
    this.store.dispatch(UserActions.createUser({payload: user}))
  }

  public updateUser(user: IUserUpdate): void {
    this.store.dispatch(UserActions.updateUser({payload: user}))
  }

  public close(): void {
    this.store.dispatch(RouterActions.navigate({path: [EAppPages.Users, EUserPages.ListUsers]}));
  }
}