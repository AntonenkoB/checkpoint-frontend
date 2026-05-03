import {inject, Injectable, Signal} from "@angular/core";
import {Store} from "@ngrx/store";
import {AppState} from "../../../../store/app-store";
import {EUserPages, IUser} from "../../models/user.model";
import {UserActions} from "../../store/actions";
import {selectAllTeachers, selectProfile} from "../../store/selectors";
import {RouterActions} from "../../../../store/router/actions";
import {EAppPages} from "@models/router.model";
import {EMarketPages} from "../../../market/models/market.model";
import {ESchedulePages} from "@schedule/models/schedule.model";

@Injectable()
export class StudentFacade {
  private store = inject<Store<AppState>>(Store);
  public profile = this.store.selectSignal(selectProfile);
  public teachersList: Signal<IUser[]> = this.store.selectSignal(selectAllTeachers);

  constructor() {
    this.store.dispatch(UserActions.allTeachers({page: 1}))
  }

  public goToLessonsType(): void {
    this.store.dispatch(RouterActions.goTo({path: [EAppPages.Market, EMarketPages.Type]}));
  }

  public goToTransferringLesson(): void {
    this.store.dispatch(RouterActions.goTo({path: [EAppPages.Schedule, ESchedulePages.TransferringLesson]}));
  }

  public close(): void {
    this.store.dispatch(RouterActions.goTo({path: [EAppPages.Users, EUserPages.ListUsers]}));
  }
}