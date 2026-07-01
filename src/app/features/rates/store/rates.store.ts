import {computed, inject} from '@angular/core';
import {Store} from '@ngrx/store';
import {patchState, signalStore, withComputed, withMethods, withState} from '@ngrx/signals';
import {setEntity, withEntities} from '@ngrx/signals/entities';
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import {catchError, concatMap, of, pipe, switchMap, tap} from 'rxjs';
import {selectRouteParam} from '../../../store/router/selectors';
import {EAppPages, ERoutParams} from '@shared/models/router.model';
import {ERatePages, IRate, IUpdateRate} from '../models/rates.model';
import {RatesService} from '../services/rates.service';
import {RouterActions} from "../../../store/router/actions";
import {HapticService} from "@shared/services/haptic.service";
import {ImpactStyle} from "@capacitor/haptics";

export interface RatesState {
  isLoading: boolean;
  allRates: IRate[];
  teacherRate: IRate[];
}

const initialState: RatesState = {
  isLoading: false,
  allRates: [],
  teacherRate: [],
};

export const RatesStore = signalStore(
  {
    providedIn: 'root'
  },
  withState(initialState),
  withEntities<IRate>(),

  withComputed((state, store = inject(Store)) => ({
    isReady: computed(() => !state.isLoading()),
    teacherId: store.selectSignal(selectRouteParam(ERoutParams.TeacherId))
  })),

  withMethods((
    state,
    ratesService = inject(RatesService),
  ) => ({

    getAllRates: rxMethod<void>(
      pipe(
        tap(() => patchState(state, {isLoading: true})),
        switchMap(() => ratesService.getAllRates().pipe(
          tap((response) => {
            const data = Array.isArray(response.data) ? response.data : [response.data];
            if (response?.data) {
              patchState(state, {allRates: data, isLoading: false});
            } else {
              patchState(state, {isLoading: false});
            }
          }),
          catchError((err) => {
            console.error(err);
            patchState(state, {isLoading: false});
            return of([]);
          })
        ))
      )
    ),

    loadTeacherRate: rxMethod<void>(
      pipe(
        tap(() => patchState(state, {isLoading: true})),
        switchMap(() => ratesService.getRate(state.teacherId()!).pipe(
          tap((response) => {
            if (response?.data) {
              patchState(state, {teacherRate: response.data as IRate[], isLoading: false});
            } else {
              patchState(state, {isLoading: false});
            }
          }),
          catchError((err) => {
            patchState(state, {isLoading: false});
            return of([]);
          })
        ))
      )
    ),
  })),

  withMethods((
    state,
    ratesService = inject(RatesService),
    store = inject(Store),
    hapticService = inject(HapticService),
  ) => ({
    updateTeacherRate: rxMethod<{id: string, data: IUpdateRate }>(
      pipe(
        tap(() => patchState(state, {isLoading: true})),
        concatMap((data) => ratesService.updateRate(data).pipe(
          tap((response) => {
            if (response?.data) {
              patchState(state, setEntity(response.data as IRate), {isLoading: false});
              state.getAllRates();
              void hapticService.impact(ImpactStyle.Medium);
              store.dispatch(RouterActions.goTo({
                path: [EAppPages.Rates, ERatePages.RateList],
              }));
            } else {
              patchState(state, {isLoading: false});
            }
          }),
          catchError((err) => {
            patchState(state, {isLoading: false});
            return of(null);
          })
        ))
      )
    )
  }))
);
