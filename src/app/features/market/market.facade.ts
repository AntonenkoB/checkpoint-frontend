import {inject, Injectable, Signal} from "@angular/core";
import {Store} from "@ngrx/store";
import {EAppPages} from "@models/router.model";
import {AppState} from "@capacitor/app";
import {EUserPages, IUser} from "@users/models/user.model";
import {selectAllTeachers, selectProfile} from "@users/store/selectors";
import {RouterActions} from "../../store/router/actions";
import {EMarketPages} from "./models/market.model";
import {UserActions} from "@users/store/actions";

@Injectable()
export class MarketFacade {
  private store = inject<Store<AppState>>(Store);
  public profile: Signal<IUser | null> = this.store.selectSignal(selectProfile);
  public teachersList = this.store.selectSignal(selectAllTeachers);
  public selectedTeacher = this.teachersList()?.[1];

  constructor() {
    this.store.dispatch(UserActions.allTeachers({page: 1}))
  }

  public goToStudentMain(): void {
    this.store.dispatch(RouterActions.goTo({path: [EAppPages.Users, EUserPages.Student]}))
  }

  public goToLessonsType(): void {
    this.store.dispatch(RouterActions.goTo({path: [EAppPages.Market, EMarketPages.Type]}))
  }

  public goToLessonsPayment(): void {
    const moreOneTeacher = true;
    if (moreOneTeacher) {
      this.goToTeachers();
      return;
    }

    this.goToLessonsTypePayment();
  }

  public goToTeachers(): void {
    this.store.dispatch(RouterActions.goTo({path: [EAppPages.Market, EMarketPages.Teachers]}))
  }

  public selectedTeacherPayment(teacher: IUser): void {
    console.log(teacher);
    this.goToLessonsTypePayment();
  }

  public goToLessonsTypePayment(): void {
    this.store.dispatch(RouterActions.goTo({path: [EAppPages.Market, EMarketPages.PaymentType]}))
  }

  public goToPayment(): void {
    this.store.dispatch(RouterActions.goTo({path: [EAppPages.Market, EMarketPages.Payment]}))
  }

  public goToPaymentSuccess(): void {
    this.store.dispatch(RouterActions.goTo({path: [EAppPages.Market, EMarketPages.PaymentSuccess]}))
  }
}