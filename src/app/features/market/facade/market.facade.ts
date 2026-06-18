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
import {ELessonsType} from "@lessons/models/lessons.model";
import {selectRouteParam} from "../../../store/router/selectors";
import {LessonsStore} from "@lessons/store/lessons.store";

@Injectable()
export class MarketFacade {
  private store = inject<Store<AppState>>(Store);
  private route = inject(ActivatedRoute);
  private profileFacade = inject(ProfileFacade);
  public marketStore = inject(MarketStore);

  private queryParams = toSignal(this.route.queryParams);
  public routTeacherId = this.store.selectSignal(selectRouteParam(ERoutParams.TeacherId));
  public readonly profile = this.profileFacade.profile;
  public currentTypePlan = computed(() => (this.queryParams()?.['typePlan']) || null);
  public currentLessonsType = computed(() => this.queryParams()?.['lessonsType']);
  public teachersList = computed(() => this.profile()?.teachers ?? []);
  public selectedTeacher = computed(() => this.teachersList()?.[0]);
  public planId = computed(() => {
    const rates = this.marketStore.teacherRate();
    const currentPlan = this.currentTypePlan();

    if (!rates || rates.length === 0 || !currentPlan) {
      return null;
    }

    if (currentPlan === EMarketPlanType.Single) {
      return rates[0]?.id ?? null;
    }

    return rates[1]?.id ?? null;
  });

  public goToStudentMain(): void {
    this.store.dispatch(RouterActions.goTo({path: [EAppPages.Student], back: true}))
  }

  public goToPayment(typePlan: EMarketPlanType): void {
    const lessonsType = +this.routTeacherId()! > 0 ? ELessonsType.TeacherGuided : ELessonsType.SelfStudy;

    this.store.dispatch(RouterActions.goTo({
      path: [EAppPages.Market, EMarketPages.Payment],
      extras: {queryParams: {typePlan, lessonsType}}
    }))
  }

  public loadTeacherRate(): void {
    if (+this.routTeacherId()! > 0) {
      this.marketStore.loadTeacherRate();
    } else {
      this.marketStore.loadIndividualRate();
    }
  }

  public purchaseLessons(paymentLessons: IMarketPurchaseLessons): void {
    this.marketStore.purchaseLessons(paymentLessons as IMarketPurchaseLessons)
  }

  public getTotalPrice(amount: number): string {
    const rates = this.marketStore.teacherRate();

    if (!rates || rates.length === 0) return '0';

    const rawPrice = this.currentTypePlan() === EMarketPlanType.Single
      ? amount * (rates[0]?.price ?? 0)
      : amount * (rates[1]?.price ?? 0);

    return rawPrice.toLocaleString('uk-UA');
  }
}