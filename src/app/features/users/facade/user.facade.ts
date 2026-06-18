import {computed, effect, inject, Injectable, Signal} from "@angular/core";
import {Store} from "@ngrx/store";
import {AppState} from "../../../store/app-store";
import {EHeaderMenu, EUserPages, IUserUpdate} from "../models/user.model";
import {IUser, EUserRole} from "@models/user.model";
import {UserActions} from "../store/actions";
import {ActivatedRoute} from "@angular/router";
import {toSignal} from "@angular/core/rxjs-interop";
import {selectAllTeachers, selectUser, selectUserLoading} from "../store/selectors";
import {RouterActions} from "../../../store/router/actions";
import {EAppPages, ERoutParams} from "@models/router.model";
import {selectQueryParam, selectRouteParams} from "../../../store/router/selectors";
import {ProfileFacade} from "@profile/facade/profile.facade";
import {StudentsStore} from "@users/store/students.store";
import {TeachersStore} from "@users/store/teachers.store";

@Injectable({ providedIn: 'root' })
export class UserFacade {
  private store = inject<Store<AppState>>(Store);
  private route = inject(ActivatedRoute);
  private profileFacade = inject(ProfileFacade);
  private studentsStore = inject(StudentsStore);
  private teachersStore = inject(TeachersStore);
  private queryParams = toSignal(this.route.queryParams);
  public menuActive = computed(() => this.queryParams()?.['role'] as EHeaderMenu);
  public roleCreate = computed(() => this.queryParams()?.['role'] as EUserRole);

  public selectRouteParams = this.store.selectSignal(selectRouteParams);
  public user = computed(() => {
    let user
    if (this.profileFacade.isAdmin() || this.profileFacade.isOwner()) {
      user = this.store.selectSignal(selectUser)();
    } else {
      switch (this.menuActive()) {
        case EHeaderMenu.Student:
          user = this.studentsStore.student();
          break;
        case EHeaderMenu.Teacher:
          user = this.teachersStore.teacher();
      }
    }

    return user;
  })
  public userLoading = this.store.selectSignal(selectUserLoading);
  public teachersList: Signal<IUser[]> = this.store.selectSignal(selectAllTeachers);
  public readonly profile = this.profileFacade.profile;
  public readonly isOwner = this.profileFacade.isOwner;
  public readonly isAdmin = this.profileFacade.isAdmin;
  public readonly isTeacher = this.profileFacade.isTeacher;

  constructor() {
  }

  public getUser(): void {
    const id = this.selectRouteParams()[ERoutParams.UserId];
    if (id) {
      if (this.profileFacade.isAdmin() || this.profileFacade.isOwner()) {
        this.store.dispatch(UserActions.getUser({userId: +id}))
      } else {
        switch (this.menuActive()) {
          case EHeaderMenu.Student:
            this.studentsStore.loadStudent(+id);
            break;
          case EHeaderMenu.Teacher:
            this.teachersStore.loadTeacher(+id);
        }
      }
    }
  }

  public createUser(user: IUserUpdate): void {
    if (this.profileFacade.isTeacher()) {
      this.studentsStore.createStudent(user);
    }

    if (this.profileFacade.isAdmin() || this.profileFacade.isOwner()) {
      this.store.dispatch(UserActions.createUser({payload: user}))
    }
  }

  public updateUser(user: IUserUpdate): void {
    if (this.profileFacade.isTeacher()) {
      this.studentsStore.updateStudent(user);
    }

    if (this.profileFacade.isAdmin() || this.profileFacade.isOwner()) {
      this.store.dispatch(UserActions.updateUser({payload: user}))
    }
  }

  public close(): void {
    this.store.dispatch(RouterActions.goTo({
      path: [EAppPages.Users, EUserPages.ListUsers],
      extras: {queryParams: {role: this.menuActive()}},
      back: true
    }));
  }

  public deleteUser(): void {
    const userId = this.user()?.id.toString() as string;
    this.store.dispatch(UserActions.deleteUser({userId}))
  }
}