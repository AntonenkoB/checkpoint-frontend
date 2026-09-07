import {computed, inject, Injectable, Signal} from "@angular/core";
import {Store} from "@ngrx/store";
import {AppState} from "../../../store/app-store";
import {CREATABLE_ROLES_MAP, EHeaderMenu, EUserPages, IUserUpdate} from "../models/user.model";
import {IUser, EUserRole, USER_ROLE_OPTIONS} from "@models/user.model";
import {ActivatedRoute} from "@angular/router";
import {toSignal} from "@angular/core/rxjs-interop";
import {RouterActions} from "../../../store/router/actions";
import {EAppPages, ERoutParams} from "@models/router.model";
import {selectRouteParams} from "../../../store/router/selectors";
import {ProfileFacade} from "@profile/facade/profile.facade";
import {StudentsStore} from "@users/store/students.store";
import {TeachersStore} from "@users/store/teachers.store";
import {UsersStore} from "@users/store/users.store";
import {NavController} from "@ionic/angular";

@Injectable({ providedIn: 'root' })
export class UserFacade {
  private store = inject<Store<AppState>>(Store);
  private route = inject(ActivatedRoute);
  private profileFacade = inject(ProfileFacade);
  private studentsStore = inject(StudentsStore);
  private teachersStore = inject(TeachersStore);
  private usersStore = inject(UsersStore);
  private navController = inject(NavController);

  private queryParams = toSignal(this.route.queryParams);
  public menuActive = computed(() => this.queryParams()?.['role'] as EHeaderMenu);
  public roleCreate = computed(() => this.queryParams()?.['role'] as EUserRole);
  public selectRouteParams = this.store.selectSignal(selectRouteParams);
  public user = computed(() => {
    let user
    if (this.profileFacade.isAdmin() || this.profileFacade.isOwner()) {
      user = this.usersStore.user();
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
  });
  public userLoading = this.usersStore.userLoading;
  public teachersList: Signal<IUser[]> = this.usersStore.usersList;
  public readonly profile = this.profileFacade.profile;
  public readonly activeRole = this.profileFacade.activeRole;
  public readonly isOwner = this.profileFacade.isOwner;
  public readonly isAdmin = this.profileFacade.isAdmin;
  public readonly isTeacher = this.profileFacade.isTeacher;

  public availableRoleOptions = computed(() => {
    const creatorRole = this.activeRole()!;

    if (this.menuActive() === EHeaderMenu.Student) return [];

    const allowed = CREATABLE_ROLES_MAP[creatorRole] ?? [];
    return USER_ROLE_OPTIONS.filter(option => allowed.includes(option.value));
  });

  constructor() {
  }

  public getUser(): void {
    const id = this.selectRouteParams()[ERoutParams.UserId];
    if (id) {
      if (this.profileFacade.isAdmin() || this.profileFacade.isOwner()) {
        this.usersStore.loadUser(+id);
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
      this.usersStore.createUser(user);
    }
  }

  public updateUser(user: IUserUpdate): void {
    if (this.profileFacade.isTeacher()) {
      this.studentsStore.updateStudent(user);
    }

    if (this.profileFacade.isAdmin() || this.profileFacade.isOwner()) {
      this.usersStore.updateUser(user);
    }
  }

  public close(): void {
    this.store.dispatch(RouterActions.goTo({
      path: [EAppPages.Users, EUserPages.ListUsers],
      extras: {queryParams: {role: this.menuActive()}},
      back: true
    }));
  }

  public goBack(): void {
    this.navController.back();
  }

  // public activateUser(): void {
  //
  // }
  //
  // public deactivateUser(): void {
  //
  // }

  public deleteUser(): void {
    const userId = this.user()?.id.toString() as string;
    this.usersStore.deleteUser(userId);
  }
}