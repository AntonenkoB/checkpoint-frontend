import {inject, computed} from '@angular/core';
import {Store} from '@ngrx/store';
import {patchState, signalStore, withComputed, withMethods, withState} from '@ngrx/signals';
import {rxMethod} from "@ngrx/signals/rxjs-interop";
import {catchError, map, of, pipe, switchMap, tap} from "rxjs";
import {withEntities} from "@ngrx/signals/entities";
import {selectQueryParam} from "../../../store/router/selectors";
import {EQueryParams} from "@models/router.model";
import {ScheduleListService} from "@schedule/services/schedule-list.service";
import {IUser} from "@models/user.model";

export interface ScheduleListState {
  isLoading: boolean;
  currentTime: string;
  currentStudent: IUser;
  currentSlotId: number;
}

const initialState: ScheduleListState = {
  isLoading: false,
  currentTime: '',
  currentStudent: {} as IUser,
  currentSlotId: 0,
};

export const ScheduleListStore = signalStore(
  {
    providedIn: 'root'
  },
  withState(initialState),
  withEntities(),

  withComputed((state, store = inject(Store)) => ({
    isReady: computed(() => !state.isLoading()),
    form: store.selectSignal(selectQueryParam(EQueryParams.From)),
    to: store.selectSignal(selectQueryParam(EQueryParams.To))
  })),

  withMethods((
    state,
    scheduleListService = inject(ScheduleListService)
  ) => ({
    getScheduleList: rxMethod<void>(
      pipe(
        tap(() => patchState(state, {isLoading: true})),
        switchMap(() => scheduleListService.getScheduleList(state.form()!, state.to()!).pipe(
          map(response => response.data),
          tap(() => {
            patchState(state, {isLoading: false});
          }),
          catchError((err) => {
            patchState(state, {isLoading: false});
            return of(null);
          })
        ))
      )
    ),
    updateCurrentStudentLocally(student: IUser): void {
      patchState(state, { currentStudent: student });
    },
    updateCurrentTimeLocally(teme: string): void {
      patchState(state, { currentTime: teme });
    },
    updateCurrentSlotIdLocally(id: number): void {
      patchState(state, { currentSlotId: id });
    },
  })),
);
