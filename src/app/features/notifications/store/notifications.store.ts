import {inject, computed} from '@angular/core';
import {patchState, signalStore, withComputed, withMethods, withState} from '@ngrx/signals';
import {rxMethod} from "@ngrx/signals/rxjs-interop";
import {catchError, of, pipe, switchMap, tap} from "rxjs";
import {NotificationsService} from "../services/notifications.service";
import {INotification, INotificationCount, INotificationsParams} from "../models/notifications.model";
import {HapticService} from "@shared/services/haptic.service";
import {ImpactStyle} from "@capacitor/haptics";
import {ProfileStore} from "@profile/store/profile.store";
import {EUserRole} from "@models/user.model";

export interface NotificationsState {
  isLoading: boolean;
  notifications: INotification[];
  notificationsCount: INotificationCount;
  lastParams: INotificationsParams | null;
}

const initialState: NotificationsState = {
  isLoading: false,
  notifications: [],
  notificationsCount: {} as INotificationCount,
  lastParams: null,
};

export const NotificationsStore = signalStore(
  {
    providedIn: 'root'
  },
  withState(initialState),

  withComputed((
    state,
  ) => ({
    isReady: computed(() => !state.isLoading()),
  })),

  withMethods((
    state,
    notificationsService = inject(NotificationsService),
    hapticService = inject(HapticService),
    profileStore = inject(ProfileStore),
  ) => ({
    getNotifications: rxMethod<INotificationsParams>(
      pipe(
        tap((params) => patchState(state, {isLoading: true, lastParams: params})),
        switchMap(({ role, status }) => notificationsService.getNotifications(role, status).pipe(
          tap((response) => {
            if (response?.data) {
              patchState(state, {notifications: response.data, isLoading: false});
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
    getNotificationCount: rxMethod<EUserRole>(
      pipe(
        tap(() => patchState(state, {isLoading: true})),
        switchMap((role) => notificationsService.getNotificationCount(role).pipe(
          tap((response) => {
            if (response?.data) {
              patchState(state, {notificationsCount: response.data, isLoading: false});
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
  })),

  withMethods((
    state,
    profileStore = inject(ProfileStore),
    notificationsService = inject(NotificationsService),
    hapticService = inject(HapticService),
  ) => ({

    readNotification: rxMethod<number>(
      pipe(
        tap(() => patchState(state, {isLoading: true})),
        switchMap((id) => notificationsService.readNotification(id).pipe(
          tap(() => {
            const params = state.lastParams();
            if (params) {
              state.getNotifications(params);
              state.getNotificationCount(params.role);
            }

            void hapticService.impact(ImpactStyle.Medium);
          }),
          catchError((err) => {
            console.error(err);
            patchState(state, {isLoading: false});
            return of([]);
          })
        ))
      )
    ),
    confirmNotification: rxMethod<number>(
      pipe(
        tap(() => patchState(state, {isLoading: true})),
        switchMap((id) => notificationsService.confirmNotification(id).pipe(
          tap(() => {
            const params = state.lastParams();
            if (params) {
              state.getNotifications(params);
              state.getNotificationCount(params.role);
            }
            void hapticService.impact(ImpactStyle.Medium);
            profileStore.getProfile();
          }),
          catchError((err) => {
            console.error(err);
            patchState(state, {isLoading: false});
            return of([]);
          })
        ))
      )
    ),
    rejectNotification: rxMethod<number>(
      pipe(
        tap(() => patchState(state, {isLoading: true})),
        switchMap((id) => notificationsService.rejectNotification(id).pipe(
          tap(() => {
            const params = state.lastParams();
            if (params) {
              state.getNotifications(params);
              state.getNotificationCount(params.role);
            }

            void hapticService.impact(ImpactStyle.Medium);
          }),
          catchError((err) => {
            console.error(err);
            patchState(state, {isLoading: false});
            return of([]);
          })
        ))
      )
    ),
  })),
);