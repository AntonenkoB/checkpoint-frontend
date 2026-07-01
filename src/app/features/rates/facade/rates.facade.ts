import {computed, inject, Injectable} from "@angular/core";
import {Store} from "@ngrx/store";
import {EAppPages, EQueryParams} from "@models/router.model";
import {AppState} from "@capacitor/app";
import {EHeaderMenu, EUserPages} from "@users/models/user.model";
import {selectAllUsers} from "@users/store/selectors";
import {RouterActions} from "../../../store/router/actions";
import {RatesStore} from "@rates/store/rates.store";
import {ERatePages, ITeacherRateGroup} from "@rates/models/rates.model";
import {SalaryStore} from "@rates/store/salary.store";
import {ActivatedRoute, Router} from "@angular/router";
import {ProfileFacade} from "@profile/facade/profile.facade";
import {toSignal} from "@angular/core/rxjs-interop";
import {ESettingsPages} from "../../settings/models/settings.model";

@Injectable()
export class RatesFacade {
  private store = inject<Store<AppState>>(Store);
  private ratesStore = inject(RatesStore);
  private salaryStore = inject(SalaryStore);
  private profileFacade = inject(ProfileFacade);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private queryParams = toSignal(
    this.router.routerState.root.queryParams,
    { initialValue: {} }
  );
  public studentsList = this.store.selectSignal(selectAllUsers);
  public currentMonth = computed(() => {
    const params = this.queryParams() as Record<EQueryParams, string>;
    return params[EQueryParams.Month];
  });
  public currentTeacher = this.salaryStore.currentTeacher;
  public ratesList = this.ratesStore.allRates;
  public profile = this.profileFacade.profile;
  public isOwner = this.profileFacade.isOwner;
  public isTeacher = this.profileFacade.isTeacher;
  public rateLoader = this.ratesStore.isReady();

  public readonly teachersRateList = computed<ITeacherRateGroup[]>(() => {
    const rates = this.ratesList();
    if (!rates) return [];

    const map = new Map<number, ITeacherRateGroup>();

    for (const rate of rates) {
      const teacherId = rate.teacher?.id ?? 0;

      if (!map.has(teacherId)) {
        map.set(teacherId, {
          teacher: rate.teacher,
          id: teacherId,
          plans: []
        });
      }

      const group = map.get(teacherId)!;
      group.plans.push({
        type: rate.type,
        teacher_amount: rate.teacher_amount ?? 0,
        school_amount: rate.school_amount ?? 0,
      });
    }

    const result = Array.from(map.values());

    return result.sort((a, b) => {
      if (a.id === 0) return -1;
      if (b.id === 0) return 1;
      return 0;
    });
  });

  public isLoading = this.ratesStore.isLoading;
  public isReady = this.ratesStore.isReady;

  constructor() {
  }

  public getAllRates(): void {
    this.ratesStore.getAllRates();
  }

  public loadTeacherRate(): void {
    this.ratesStore.loadTeacherRate();
  }

  public goToRateList(): void {
    this.store.dispatch(RouterActions.goTo({
      path: [EAppPages.Rates, ERatePages.RateList],
      back: true
    }));
  }

  public goToSettings(): void {
    this.store.dispatch(RouterActions.goTo({
      path: [EAppPages.Settings, ESettingsPages.List],
      back: true
    }));
  }

  public goToSalaryList(): void {
    if (this.profileFacade.isOwner()) {
      this.store.dispatch(RouterActions.goTo({
        path: [EAppPages.Rates, ERatePages.SalaryList],
        extras: {queryParams: {month: this.currentMonth()}},
        back: true
      }));

      return;
    }

    this.store.dispatch(RouterActions.goTo({
      path: [EAppPages.Users, EUserPages.ListUsers],
      extras: {queryParams: {tab: EHeaderMenu.Student}}
    }));
  }

  public changeAllSalaryMonth(month: string): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {month},
      queryParamsHandling: 'merge',
    });

    setTimeout(() => {
      this.salaryStore.getAllSalary();
    }, 0)
  }

  public goToSettingRate(id: number): void {
    this.store.dispatch(RouterActions.goTo({path: [EAppPages.Rates, ERatePages.RateItem, id]}));
  }

  public goToSalaryItem(id: number): void {
    this.store.dispatch(RouterActions.goTo({path: [EAppPages.Rates, ERatePages.SalaryItem, id], extras: {queryParams: {month: this.salaryStore.month()}}}));
  }

  public changeSalaryMonth(month: string): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {month},
      queryParamsHandling: 'merge',
    });

    setTimeout(() => {
      this.salaryStore.getTeacherSalary();
    }, 0)
  }
}