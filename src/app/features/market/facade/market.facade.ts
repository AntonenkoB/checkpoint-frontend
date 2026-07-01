import {computed, inject, Injectable} from "@angular/core";
import {Store} from "@ngrx/store";
import {EAppPages, ERoutParams} from "@models/router.model";
import {AppState} from "@capacitor/app";
import {RouterActions} from "../../../store/router/actions";
import {EMarketPages, EMarketPlanType, IMarketPurchaseLessons} from "../models/market.model";
import {toSignal} from "@angular/core/rxjs-interop";
import {ActivatedRoute} from "@angular/router";
import {MarketStore} from "@market/store/market.store";
import {ProfileFacade} from "@profile/facade/profile.facade";
import {ELessonFlow, ELessonsType} from "@lessons/models/lessons.model";
import {selectRouteParam} from "../../../store/router/selectors";
import {LessonsStore} from "@lessons/store/lessons.store";
import {RatesStore} from "@rates/store/rates.store";
import {ERatesType} from "@rates/models/rates.model";
import {ESettingsPages} from "@settings/models/settings.model";

@Injectable()
export class MarketFacade {
  private store = inject<Store<AppState>>(Store);
  private route = inject(ActivatedRoute);
  private profileFacade = inject(ProfileFacade);
  public marketStore = inject(MarketStore);
  public lessonsStore = inject(LessonsStore);
  public ratesStore = inject(RatesStore);

  private queryParams = toSignal(this.route.queryParams);
  public routTeacherId = this.store.selectSignal(selectRouteParam(ERoutParams.TeacherId));
  public readonly profile = this.profileFacade.profile;
  public currentTypePlan = computed(() => (this.queryParams()?.['typePlan']) || null);
  public currentLessonsType = computed(() => this.queryParams()?.['lessonsType']);
  public addFreeLessons = computed(() => !!this.queryParams()?.['free']);
  public currentLessonsFlow = computed(() => this.queryParams()?.['lessonsFlow']);
  public teachersList = computed(() => this.profile()?.teachers ?? []);
  public selectedTeacher = computed(() => this.lessonsStore.currentUser()!);
  public planId = computed(() => {
    const isStudent = this.profileFacade.isStudent();
    const teacherRateMarket = this.marketStore.teacherRate();
    const teacherRateRates = this.ratesStore.teacherRate();
    const allRateRates = this.ratesStore.allRates();

    // refactoring - add "free" to ELessonFlow
    const rates = isStudent ? teacherRateMarket : this.currentLessonsType() === ELessonsType.TeacherGuided ? teacherRateRates : allRateRates;
    const currentPlan = this.currentTypePlan();

    if (!rates || rates.length === 0 || !currentPlan) {
      return null;
    }

    if (currentPlan === EMarketPlanType.Single) {
      const rate = rates.find(r => r.type === ERatesType.Single);
      return rate?.id ?? null;
    }

    const rate = rates.find(r => r.type === ERatesType.Subscription);
    return rate?.id ?? null;
  });

  public readonly abonnementParams = computed(() => {
    const isStudent = this.profileFacade.isStudent();
    const teacherRateMarket = this.marketStore.teacherRate();
    const teacherRateRates = this.ratesStore.teacherRate();

    if (!isStudent) {
      return {
        total: 0,
        perLesson: 0,
        count: 0
      };
    }

    const rates = isStudent ? teacherRateMarket : teacherRateRates;
    const rate = rates.find(r => r.type === ERatesType.Subscription);

    if (!rate) {
      return null
    }

    return {
      total: +rate.price,
      perLesson: Math.round(rate.price / rate.lessons_per_unit),
      count: +rate.lessons_per_unit
    };
  });

  public goToStudentMain(): void {
    this.store.dispatch(RouterActions.goTo({path: [EAppPages.Student], back: true}))
  }

  public goToPayment(typePlan: EMarketPlanType): void {
    const lessonsType = +this.routTeacherId()! > 0 ? ELessonsType.TeacherGuided : ELessonsType.SelfStudy;

    this.store.dispatch(RouterActions.goTo({
      path: [EAppPages.Market, EMarketPages.Payment],
      extras: {
        queryParams: {typePlan, lessonsType},
        queryParamsHandling: 'merge'
      }
    }))
  }

  public loadTeacherRate(): void {
    if (+this.routTeacherId()! > 0) {
      if (this.currentLessonsFlow() === ELessonFlow.Purchase) {
        this.marketStore.loadTeacherRate();
      }

      if (this.currentLessonsFlow() === ELessonFlow.AddFree) {
        this.ratesStore.loadTeacherRate()
      }
    } else {
      if (this.currentLessonsFlow() === ELessonFlow.Purchase) {
        this.marketStore.loadIndividualRate();
      }

      if (this.currentLessonsFlow() === ELessonFlow.AddFree) {
        this.ratesStore.getAllRates()
      }
    }
  }

  public purchaseLessons(paymentLessons: IMarketPurchaseLessons): void {
    if (this.currentLessonsFlow() === ELessonFlow.Purchase) {
      this.marketStore.purchaseLessons(paymentLessons as IMarketPurchaseLessons)
    }

    if (this.currentLessonsFlow() === ELessonFlow.AddFree) {
      const data = {
        ...paymentLessons,
        student_id: this.lessonsStore.currentUser()?.id,
      } as IMarketPurchaseLessons
      this.marketStore.addFreeLessons(data);
    }
  }

  public getTotalPrice(amount: number): string {
    const rates = this.marketStore.teacherRate();

    if (!rates || rates.length === 0) return '0';

    const rawPrice = this.currentTypePlan() === EMarketPlanType.Single
      ? amount * (rates[0]?.price ?? 0)
      : amount * (rates[1]?.price ?? 0);

    return rawPrice.toLocaleString('uk-UA');
  }

  public closeMarketPage(): void {
    if (this.currentLessonsFlow() === ELessonFlow.AddFree) {
      this.store.dispatch(RouterActions.goTo({
        path: [EAppPages.Settings, ESettingsPages.List],
        back: true
      }))
    } else {
      this.goToStudentMain()
    }
  }
}