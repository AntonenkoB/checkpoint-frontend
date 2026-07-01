import {inject, computed} from '@angular/core';
import {Store} from '@ngrx/store';
import {patchState, signalStore, withComputed, withMethods, withState} from '@ngrx/signals';
import {rxMethod} from "@ngrx/signals/rxjs-interop";
import {catchError, map, of, pipe, switchMap, tap} from "rxjs";
import {withEntities} from "@ngrx/signals/entities";
import {EMarketPages, IMarketPurchaseLessons, IPaymentSuccess} from "../models/market.model";
import {MarketService} from "../services/market.service";
import {IRate} from "@rates/models/rates.model";
import {selectQueryParam, selectRouteParam} from "../../../store/router/selectors";
import {EAppPages, ERoutParams} from "@models/router.model";
import {filter} from "rxjs/operators";
import {RouterActions} from "../../../store/router/actions";
import {ProfileStore} from "@profile/store/profile.store";
import {ImpactStyle} from "@capacitor/haptics";
import {HapticService} from "@shared/services/haptic.service";

export interface MarketState {
  isLoading: boolean;
  teacherRate: IRate[];
  paymentSuccessData: IPaymentSuccess;
}

const initialState: MarketState = {
  isLoading: false,
  teacherRate: [],
  paymentSuccessData: {} as IPaymentSuccess,
};

export const MarketStore = signalStore(
  {
    providedIn: 'root'
  },
  withState(initialState),
  withEntities(),

  withComputed((
    state,
    store = inject(Store),
  ) => ({
    isReady: computed(() => !state.isLoading()),
    teacherId: store.selectSignal(selectRouteParam(ERoutParams.TeacherId)),
    typePla: store.selectSignal(selectQueryParam('typePlan')),
  })),

  withMethods((
    state,
    marketService = inject(MarketService),
    store = inject(Store),
    profileStore = inject(ProfileStore),
    hapticService = inject(HapticService),
  ) => ({
    loadTeacherRate: rxMethod<void>(
      pipe(
        filter(() => !!state.teacherId()),
        tap(() => patchState(state, {isLoading: true})),
        switchMap(() => marketService.getRate(state.teacherId()!).pipe(
          tap((response) => {
            if (response?.data) {
              patchState(state, {teacherRate: response.data as IRate[], isLoading: false});
            } else {
              patchState(state, {isLoading: false});
            }
          }),
          catchError((err) => {
            console.error(err);
            patchState(state, {isLoading: false});
            return of([]);
          }),
        ))
      )
    ),
    loadIndividualRate: rxMethod<void>(
      pipe(
        filter(() => !!state.teacherId()),
        tap(() => patchState(state, {isLoading: true})),
        switchMap(() => marketService.getIndividualRate().pipe(
          tap((response) => {
            if (response?.data) {
              patchState(state, {teacherRate: response?.data as IRate[], isLoading: false});
            } else {
              patchState(state, {isLoading: false});
            }
          }),
          catchError((err) => {
            console.error(err);
            patchState(state, {isLoading: false});
            return of([]);
          }),
        ))
      )
    ),
    purchaseLessons: rxMethod<IMarketPurchaseLessons>(
      pipe(
        tap(() => patchState(state, {isLoading: true})),
        switchMap((data) => marketService.purchaseLessons(data).pipe(
          map(response => response.data),
          tap((responseData) => {
            patchState(state, {
              isLoading: false,
              paymentSuccessData: responseData
            });

            void hapticService.impact(ImpactStyle.Medium);
            profileStore.getProfile();
            store.dispatch(RouterActions.goTo({
              path: [EAppPages.Market, EMarketPages.PaymentSuccess],
            }));
          }),
          catchError((err) => {
            patchState(state, {isLoading: false});
            return of(null);
          })
        ))
      )
    ),
    addFreeLessons: rxMethod<IMarketPurchaseLessons>(
      pipe(
        tap(() => patchState(state, {isLoading: true})),
        switchMap((data) => marketService.addFreeLessons(data).pipe(
          map(response => response.data),
          tap((responseData) => {
            patchState(state, {
              isLoading: false,
              paymentSuccessData: responseData
            });

            void hapticService.impact(ImpactStyle.Medium);
            store.dispatch(RouterActions.goTo({
              path: [EAppPages.Market, EMarketPages.PaymentSuccess],
              extras: {queryParamsHandling: 'merge'},
            }));
          }),
          catchError((err) => {
            patchState(state, {isLoading: false});
            return of(null);
          })
        ))
      )
    ),
  })),
);
