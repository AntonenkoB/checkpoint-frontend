import {inject, computed} from '@angular/core';
import {Store} from '@ngrx/store';
import {patchState, signalStore, withComputed, withMethods, withState} from '@ngrx/signals';
import {ScheduleService} from "@schedule/services/schedule.service";
import {rxMethod} from "@ngrx/signals/rxjs-interop";
import {catchError, concatMap, debounceTime, filter, map, of, pipe, switchMap, tap} from "rxjs";
import {entityConfig, setAllEntities, withEntities} from "@ngrx/signals/entities";
import {selectQueryParam} from "../../../store/router/selectors";
import {EQueryParams} from "@models/router.model";
import {EDayOfWeek, IScheduleItem, ITimeRange, IWeeklyScheduleItem} from "@schedule/models/schedule.model";
import {ToastService} from "@shared/services/toast.service";
import {ImpactStyle} from "@capacitor/haptics";
import {HapticService} from "@shared/services/haptic.service";

export interface ScheduleState {
  isLoading: boolean;
}

const initialState: ScheduleState = {
  isLoading: false,
};

const slotsConfig = entityConfig({
  entity: {} as IScheduleItem,
  collection: 'slots',
});

const weeklyConfig = entityConfig({
  entity: {} as IWeeklyScheduleItem,
  collection: 'weekly',
});

export const ScheduleStore = signalStore(
  {
    providedIn: 'root'
  },
  withState(initialState),
  withEntities(slotsConfig),
  withEntities(weeklyConfig),

  withComputed((state, store = inject(Store)) => ({
    isReady: computed(() => !state.isLoading()),
    form: store.selectSignal(selectQueryParam(EQueryParams.From)),
    to: store.selectSignal(selectQueryParam(EQueryParams.To))
  })),

  withMethods((
    state,
    ratesService = inject(ScheduleService),
  ) => ({
    getSlots: rxMethod<void>(
      pipe(
        filter(() => !!state.form()),
        filter(() => !!state.to()),
        tap(() => patchState(state, {isLoading: true})),
        switchMap(() => ratesService.getSlots(state.form()!, state.to()!).pipe(
          map(response => response.data),
          tap((data: IScheduleItem[]) => {
            patchState(state, setAllEntities(data, slotsConfig), {isLoading: false});
          }),
          catchError((err) => {
            patchState(state, {isLoading: false});
            return of(null);
          })
        ))
      )
    ),

    getWeekly: rxMethod<void>(
      pipe(
        tap(() => patchState(state, {isLoading: true})),
        switchMap(() => ratesService.getWeekly().pipe(
          map(response => response.data),
          tap((data) => {
            patchState(state, setAllEntities(data, weeklyConfig), {isLoading: false});
          }),
          catchError((err) => {
            console.error(err);
            patchState(state, {isLoading: false});
            return of(null);
          })
        ))
      )
    ),

    getIndividualSlots: rxMethod<void>(
      pipe(
        tap(() => patchState(state, {isLoading: true})),
        switchMap(() => ratesService.getIndividualSlots(state.form()!, state.to()!).pipe(
          map(response => response.data),
          tap((data: IScheduleItem[]) => {
            patchState(state, setAllEntities(data, slotsConfig), {isLoading: false});
          }),
          catchError((err) => {
            patchState(state, {isLoading: false});
            return of(null);
          })
        ))
      )
    ),

    getOverviewSlots: rxMethod<void>(
      pipe(
        tap(() => patchState(state, {isLoading: true})),
        switchMap(() => ratesService.getOverviewSlots(state.form()!, state.to()!).pipe(
          map(response => response.data),
          tap((data: IScheduleItem[]) => {
            patchState(state, setAllEntities(data, slotsConfig), {isLoading: false});
          }),
          catchError((err) => {
            patchState(state, {isLoading: false});
            return of(null);
          })
        ))
      )
    ),

    getIndividualWeekly: rxMethod<void>(
      pipe(
        tap(() => patchState(state, {isLoading: true})),
        switchMap(() => ratesService.getIndividualWeekly().pipe(
          map(response => response.data),
          tap((data) => {
            patchState(state, setAllEntities(data, weeklyConfig), {isLoading: false});
          }),
          catchError((err) => {
            console.error(err);
            patchState(state, {isLoading: false});
            return of(null);
          })
        ))
      )
    )
  })),

  withMethods((
    store,
    ratesService = inject(ScheduleService),
    toastService = inject(ToastService),
    hapticService = inject(HapticService),
  ) => ({
    setWeekSlot: rxMethod<{ day_of_week: EDayOfWeek, slots: ITimeRange[] }>(
      pipe(
        tap(() => patchState(store, {isLoading: true})),
        switchMap((data) => ratesService.setWeekSlot(data).pipe(
          tap(() => {
            patchState(store, {isLoading: false});
            toastService.success('Графік оновлено');
            void hapticService.impact(ImpactStyle.Medium);
            store.getWeekly();
          }),
          catchError((err) => {
            console.error(err);
            patchState(store, {isLoading: false});
            return of(null);
          })
        )),
      )
    ),

    deleteWeekSlot: rxMethod<string>(
      pipe(
        tap(() => patchState(store, {isLoading: true})),
        concatMap((data) => ratesService.deleteWeekSlot(data).pipe(
          tap(() => {
            patchState(store, {isLoading: false});
            void hapticService.impact(ImpactStyle.Medium);
            store.getWeekly();
          }),
          catchError((err) => {
            console.error(err);
            patchState(store, {isLoading: false});
            return of(null);
          })
        ))
      )
    ),

    setIndividualWeekSlot: rxMethod<{ day_of_week: EDayOfWeek, slots: ITimeRange[] }>(
      pipe(
        tap(() => patchState(store, {isLoading: true})),
        switchMap((data) => ratesService.setIndividualWeekSlot(data).pipe(
          tap(() => {
            patchState(store, {isLoading: false});
            toastService.success('Графік оновлено');
            void hapticService.impact(ImpactStyle.Medium);
            store.getOverviewSlots();
            store.getIndividualWeekly();
          }),
          catchError((err) => {
            console.error(err);
            patchState(store, {isLoading: false});
            return of(null);
          })
        )),
      )
    ),

    deleteIndividualWeekSlot: rxMethod<string>(
      pipe(
        tap(() => patchState(store, {isLoading: true})),
        concatMap((data) => ratesService.deleteIndividualWeekSlot(data).pipe(
          tap(() => {
            patchState(store, {isLoading: false});
            void hapticService.impact(ImpactStyle.Medium);
            store.getIndividualWeekly();
          }),
          catchError((err) => {
            console.error(err);
            patchState(store, {isLoading: false});
            return of(null);
          })
        ))
      )
    )
  })),

  withMethods((
    store,
    ratesService = inject(ScheduleService),
    toastService = inject(ToastService),
    hapticService = inject(HapticService),
  ) => ({
    setSlots: rxMethod<{ date: string, slots: ITimeRange[] }>(
      pipe(
        tap(() => patchState(store, {isLoading: true})),
        switchMap((data) => ratesService.setSlots(data).pipe(
          tap(() => {
            patchState(store, {isLoading: false});
            toastService.success('Графік оновлено');
            void hapticService.impact(ImpactStyle.Medium);
            store.getSlots();
          }),
          catchError((err) => {
            console.error(err);
            patchState(store, {isLoading: false});
            return of(null);
          })
        ))
      )
    ),

    deleteSlots: rxMethod<string>(
      pipe(
        tap(() => patchState(store, {isLoading: true})),
        switchMap((data) => ratesService.deleteSlots(data).pipe(
          tap(() => {
            patchState(store, {isLoading: false});
            void hapticService.impact(ImpactStyle.Medium);
            store.getSlots();
          }),
          catchError((err) => {
            console.error(err);
            patchState(store, {isLoading: false});
            return of(null);
          })
        ))
      )
    ),

    setIndividualSlots: rxMethod<{ date: string, slots: ITimeRange[] }>(
      pipe(
        tap(() => patchState(store, {isLoading: true})),
        switchMap((data) => ratesService.setIndividualSlots(data).pipe(
          tap(() => {
            patchState(store, {isLoading: false});
            toastService.success('Графік оновлено');
            void hapticService.impact(ImpactStyle.Medium);
            store.getOverviewSlots();
            store.getIndividualSlots();
          }),
          catchError((err) => {
            console.error(err);
            patchState(store, {isLoading: false});
            return of(null);
          })
        ))
      )
    ),

    deleteIndividualSlots: rxMethod<string>(
      pipe(
        tap(() => patchState(store, {isLoading: true})),
        switchMap((data) => ratesService.deleteIndividualSlots(data).pipe(
          tap(() => {
            patchState(store, {isLoading: false});
            void hapticService.impact(ImpactStyle.Medium);
            store.getIndividualSlots();
          }),
          catchError((err) => {
            console.error(err);
            patchState(store, {isLoading: false});
            return of(null);
          })
        ))
      )
    )
  }))
);
