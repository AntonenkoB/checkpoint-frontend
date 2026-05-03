import {computed, inject, Injectable, Signal} from "@angular/core";
import {Store} from "@ngrx/store";
import {AppState} from "../../../../store/app-store";
import {EHeaderMenu, ERateTabs, EUserPages, EUserRole, IUser} from "../../models/user.model";
import {selectAllUsers, selectAllUsersPagination, selectProfile, selectUserLoading} from "../../store/selectors";
import {UserActions} from "../../store/actions";
import {RouterActions} from "../../../../store/router/actions";
import {EAppPages} from "@models/router.model";
import {IPagination} from "@models/api.models";
import {toSignal} from "@angular/core/rxjs-interop";
import {ActivatedRoute, Router} from "@angular/router";
import {ERatePages} from "@rates/models/rates.model";

@Injectable()
export class UserListFacade {
  private store = inject<Store<AppState>>(Store);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private queryParams = toSignal(this.route.queryParams);
  public currentTab = computed(() => (this.queryParams()?.['tab'] as EHeaderMenu) || EHeaderMenu.Student);
  public currentRacesTab = computed(() => (this.queryParams()?.['ratesTab'] as ERateTabs) || ERateTabs.Price);
  public userList: Signal<IUser[]> = this.store.selectSignal(selectAllUsers);
  public profile: Signal<IUser | null> = this.store.selectSignal(selectProfile);
  public userListPagination: Signal<IPagination> = this.store.selectSignal(selectAllUsersPagination);
  public userListLoading: Signal<boolean> = this.store.selectSignal(selectUserLoading);

  public selectMenu(selectMenu: EHeaderMenu, page: number = 1): void {
    switch (selectMenu) {
      case EHeaderMenu.Student:
        this.getUserList(EUserRole.Student, page);
        break;
      case EHeaderMenu.Teacher:
        this.getUserList(EUserRole.Teacher, page);
        break;
      case EHeaderMenu.Admin:
        this.getUserList(EUserRole.Admin, page);
        break;
      case EHeaderMenu.Schedule:
        this.goToSchedule(EHeaderMenu.Schedule);
        break;
    }
  }

  public selectRatesMenu(ratesTab: ERateTabs): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { ratesTab },
      queryParamsHandling: 'merge',
    });
  }

  private getUserList(role: EUserRole, page: number = 1): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: role },
      queryParamsHandling: 'merge',
    });
    this.store.dispatch(UserActions.allUsers({role, page}))
  }

  public goToSchedule(role: EHeaderMenu): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: role },
      queryParamsHandling: 'merge',
    });
  }

  public create(role: EUserRole | string): void {
    if (role === EHeaderMenu.Schedule) {
      const userId = this.profile()?.id ?? 0
      this.store.dispatch(RouterActions.goTo({path: [EAppPages.Schedule, userId]}));
      return;
    }

    this.store.dispatch(RouterActions.goTo({path: [EAppPages.Users, EUserPages.Create], extras: {queryParams: {role}}}))
  }

  public goToUser(id: number, role: EUserRole | string, ratesMenu?: ERateTabs): void {
    if (ratesMenu === ERateTabs.Price && role === EHeaderMenu.Teacher) {
      this.store.dispatch(RouterActions.goTo({path: [EAppPages.Rates, ERatePages.RateItem, id]}));
      return
    }

    if (ratesMenu === ERateTabs.Salary && role === EHeaderMenu.Teacher) {
      this.store.dispatch(RouterActions.goTo({path: [EAppPages.Rates, ERatePages.Salary]}));
      return;
    }

    this.store.dispatch(RouterActions.goTo({path: [EAppPages.Users, EUserPages.User, id], extras: {queryParams: {role}}}))
  }

  public goToProfile(): void {
    this.store.dispatch(RouterActions.goTo({path: [EAppPages.Users, EUserPages.Profile]}))
  }
}
