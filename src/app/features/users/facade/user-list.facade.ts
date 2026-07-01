import {computed, DestroyRef, inject, Injectable, Signal} from "@angular/core";
import {Store} from "@ngrx/store";
import {AppState} from "../../../store/app-store";
import {EHeaderMenu, EUserPages} from "../models/user.model";
import {EUserRole} from "@models/user.model";
import {selectAllUsers, selectAllUsersPagination, selectUserLoading} from "../store/selectors";
import {UserActions} from "../store/actions";
import {RouterActions} from "../../../store/router/actions";
import {EAppPages} from "@models/router.model";
import {IPagination} from "@models/api.models";
import {takeUntilDestroyed, toSignal} from "@angular/core/rxjs-interop";
import {ActivatedRoute, Router} from "@angular/router";
import {DatePipe} from "@angular/common";
import {ProfileFacade} from "@profile/facade/profile.facade";
import {StudentsStore} from "@users/store/students.store";
import {debounceTime, distinctUntilChanged, Subject} from "rxjs";
import {ESettingsPages} from "../../settings/models/settings.model";

@Injectable({ providedIn: 'root' })
export class UserListFacade {
  private store = inject<Store<AppState>>(Store);
  private router = inject(Router);
  public route = inject(ActivatedRoute);
  private studentsStore = inject(StudentsStore);
  private profileFacade = inject(ProfileFacade);
  private datePipe = inject(DatePipe);

  private queryParams = toSignal(this.route.queryParams);
  public currentTab = computed(() => {
    const tab = this.queryParams()?.['tab'] as EHeaderMenu;
    return tab ?? EHeaderMenu.Schedule;
  });
  private searchSubject$ = new Subject<string>();
  private destroyRef = inject(DestroyRef);

  public userList = computed(() => {
    const students = this.studentsStore.studentsList();
    const users = this.store.selectSignal(selectAllUsers)();
    const currentTab = this.currentTab();

    if (currentTab === EHeaderMenu.Student && this.profileFacade.isTeacher()) {
      return students ?? [];
    }

    return users ?? [];
  });
  public profile = this.profileFacade.profile;
  public activeRole = this.profileFacade.activeRole;
  public isReadyStudent = this.studentsStore.isReady;
  public amountStudents = this.studentsStore.studentsListMeta;
  public userListPagination: Signal<IPagination> = this.store.selectSignal(selectAllUsersPagination);
  public userListLoading: Signal<boolean> = this.store.selectSignal(selectUserLoading);

  constructor() {
    this.searchSubject$.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((search) => {
      this.selectMenu(this.currentTab(), 1, search)
    })
  }

  public selectMenu(selectMenu: EHeaderMenu, page: number = 1, search: string = ''): void {
    switch (selectMenu) {
      case EHeaderMenu.Student:
        this.getStudents(page, search);
        break;
      case EHeaderMenu.Teacher:
        this.getTeachers(page)
        break;
      case EHeaderMenu.Admin:
        this.getAdmins(page);
        break;
      case EHeaderMenu.Schedule:
        this.goToSchedule(EHeaderMenu.Schedule);
        break;
    }
  }

  private getStudents(page: number, search: string): void {
    let queryParams = {
      tab: EUserRole.Student,
      search
    }

    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
    });

    if (this.profileFacade.isAdmin() || this.profileFacade.isOwner()) {
      this.store.dispatch(UserActions.allUsers({role: EUserRole.Student, page, search}))

      return;
    }

    this.studentsStore.loadStudentsList(search);
  }

  private getTeachers(page: number): void {
    let queryParams = {
      tab: EUserRole.Teacher,
    }

    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge',
    });

    this.store.dispatch(UserActions.allUsers({role: EUserRole.Teacher, page}))
  }

  private getAdmins(page: number): void {
    let queryParams = {
      tab: EUserRole.Admin
    }

    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
    });

    this.store.dispatch(UserActions.allUsers({role: EUserRole.Admin, page}))
  }

  public searchUser(search: string): void {
    this.searchSubject$.next(search);
  }

  public goToSchedule(role: EHeaderMenu): void {
    const dateTo = new Date();
    dateTo.setMonth(dateTo.getMonth() + 2);
    const from = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    const to = this.datePipe.transform(dateTo, 'yyyy-MM-dd');

    let params = {
      tab: role,
      from,
      to
    }

    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: 'merge',
    });
  }

  public create(role: EUserRole | string): void {
    if (role === EHeaderMenu.Schedule) {
      const userId = this.profile()?.id ?? 0
      const dateTo = new Date();
      dateTo.setMonth(dateTo.getMonth() + 2);

      const from = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
      const to = this.datePipe.transform(dateTo, 'yyyy-MM-dd');
      this.store.dispatch(RouterActions.goTo({path: [EAppPages.Schedule, userId], extras: {queryParams: {from, to}}}));
      return;
    }

    this.store.dispatch(RouterActions.goTo({path: [EAppPages.Users, EUserPages.CreateUser], extras: {queryParams: {role}}}))
  }

  public goToUser(id: number, role: EUserRole | string): void {
    this.store.dispatch(RouterActions.goTo({path: [EAppPages.Users, EUserPages.User, id], extras: {queryParams: {role}}}))
  }

  public goToSettings(): void {
    this.store.dispatch(RouterActions.goTo({path: [EAppPages.Settings, ESettingsPages.List]}))
  }
}
