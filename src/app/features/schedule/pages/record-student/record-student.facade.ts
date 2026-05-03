import {inject} from "@angular/core";
import {Store} from "@ngrx/store";
import {AppState} from "@capacitor/app";
import {EAppPages} from "@models/router.model";
import {ESchedulePages} from "../../models/schedule.model";
import {EUserRole} from "@users/models/user.model";
import {UserActions} from "@users/store/actions";
import {selectAllUsers, selectProfile} from "@users/store/selectors";
import {RouterActions} from "../../../../store/router/actions";


export class recordStudentFacade {
  private store = inject<Store<AppState>>(Store);
  public studentsList = this.store.selectSignal(selectAllUsers);
  public profile = this.store.selectSignal(selectProfile);


  constructor() {
    this.store.dispatch(UserActions.allUsers({role: EUserRole.Student, page: 1}))
  }

  public goToSchedule(): void {
    const userId = this.profile()?.id ?? 0
    this.store.dispatch(RouterActions.goTo({path: [EAppPages.Users, EAppPages.Schedule, ESchedulePages.List ,userId]}))
  }

  public goToRecordTime(): void {
    this.store.dispatch(RouterActions.goTo({path: [EAppPages.Schedule, ESchedulePages.RecordTime]}))
  }
}