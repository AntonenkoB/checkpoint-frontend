import {inject, Injectable, Signal} from "@angular/core";
import {Store} from "@ngrx/store";
import {EAppPages} from "@models/router.model";
import {AppState} from "@capacitor/app";
import {EHeaderMenu, EUserPages, EUserRole, IUser} from "../users/models/user.model";
import {selectAllUsers, selectProfile} from "../users/store/selectors";
import { selectRouteParams } from "src/app/store/router/selectors";
import {UserActions} from "../users/store/actions";
import {RouterActions} from "../../store/router/actions";
import {ESchedulePages} from "./models/schedule.model";


@Injectable()
export class ScheduleFacade {
  private store = inject<Store<AppState>>(Store);
  public profile: Signal<IUser | null> = this.store.selectSignal(selectProfile);
  public selectRouteParams = this.store.selectSignal(selectRouteParams);
  public studentsList = this.store.selectSignal(selectAllUsers);

  constructor() {
    this.store.dispatch(UserActions.allUsers({role: EUserRole.Student, page: 1}))
  }

  public goToSchedule(): void {
    this.store.dispatch(RouterActions.goTo({path: [EAppPages.Users, ESchedulePages.List], extras: { queryParams: { tab: EHeaderMenu.Schedule }}}))
  }

  public goToRecordTime(): void {
    this.store.dispatch(RouterActions.goTo({path: [EAppPages.Schedule, ESchedulePages.RecordTime]}))
  }

  public goToRecordStudent(): void {
    this.store.dispatch(RouterActions.goTo({path: [EAppPages.Schedule, ESchedulePages.RecordStudent]}))
  }

  public goToTransferringLesson(): void {
    this.store.dispatch(RouterActions.goTo({path: [EAppPages.Schedule, ESchedulePages.TransferringLesson]}))
  }

  public goToCanceledLesson(): void {
    this.store.dispatch(RouterActions.goTo({path: [EAppPages.Schedule, ESchedulePages.LessonCanceled]}))
  }
}