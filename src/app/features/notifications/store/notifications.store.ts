import {inject, computed} from '@angular/core';
import {patchState, signalStore, withComputed, withMethods, withState} from '@ngrx/signals';
import {rxMethod} from "@ngrx/signals/rxjs-interop";
import {catchError, of, pipe, switchMap, tap} from "rxjs";
import {NotificationsService} from "../services/notifications.service";
import {
  ENotificationStatus,
  INotification,
  INotificationCount,
  INotificationsParams
} from "../models/notifications.model";
import {HapticService} from "@shared/services/haptic.service";
import {ImpactStyle} from "@capacitor/haptics";
import {ProfileStore} from "@profile/store/profile.store";
import {EUserRole} from "@models/user.model";
import {IPagination} from "@models/api.models";
import {hasNextPage, mergePage} from "@shared/utils/handle-api-response";
import {StudentStore} from "@student/store/student.store";

export interface NotificationsState {
  isLoading: boolean;
  notificationsUnread: INotification[];
  notifications: INotification[];
  notificationsCount: INotificationCount;
  notificationsMeta: IPagination | null;
  lastParams: INotificationsParams | null;
}

const initialState: NotificationsState = {
  isLoading: false,
  notificationsUnread: [],
  notifications: [],
  notificationsCount: {} as INotificationCount,
  notificationsMeta: null,
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
    canLoadMoreNotifications: computed(() => hasNextPage(state.notificationsMeta())),
  })),

  withMethods((
    state,
    notificationsService = inject(NotificationsService),
    hapticService = inject(HapticService),
    profileStore = inject(ProfileStore),
  ) => ({
    getNotifications: rxMethod<INotificationsParams>(
      pipe(
        tap(({role, status}) => patchState(state, {isLoading: true, lastParams: {role, status}})),
        switchMap(({role, status, page = 1, append = false}) => notificationsService.getNotifications(role, status, page).pipe(
          tap((response) => {
            if (response?.data) {
              patchState(state, {
                notifications: mergePage(state.notifications(), response.data, append),
                notificationsMeta: response.meta ?? null,
                isLoading: false,
              });
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
    getNotificationsUnread: rxMethod<INotificationsParams>(
      pipe(
        tap(({role, status}) => patchState(state, {isLoading: true, lastParams: {role, status}})),
        switchMap(({role, status, page = 1, append = false}) => notificationsService.getNotifications(role, status, page).pipe(
          tap((response) => {
            if (response?.data) {
              patchState(state, {
                notificationsUnread: response.data,
                isLoading: false,
              });
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
    studentStore = inject(StudentStore),
    notificationsService = inject(NotificationsService),
    hapticService = inject(HapticService),
  ) => ({
    loadMoreNotifications(): void {
      const meta = state.notificationsMeta();
      const params = state.lastParams();
      if (state.isLoading() || !params || !hasNextPage(meta)) return;
      state.getNotifications({...params, page: meta!.currentPage + 1, append: true});
    },

    readNotification: rxMethod<number>(
      pipe(
        tap(() => patchState(state, {isLoading: true})),
        switchMap((id) => notificationsService.readNotification(id).pipe(
          tap(() => {
            const params = state.lastParams();

            if (params) {
              if (params.status === ENotificationStatus.Unread) {
                state.getNotificationsUnread(params);
              } else {
                state.getNotifications(params);
              }
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
              if (params.status === ENotificationStatus.Unread) {
                state.getNotificationsUnread(params);
              } else {
                state.getNotifications(params);
              }
              state.getNotificationCount(params.role);
            }

            void hapticService.impact(ImpactStyle.Medium);
            profileStore.getProfile();
            studentStore.getLessons();
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
              if (params.status === ENotificationStatus.Unread) {
                state.getNotificationsUnread(params);
              } else {
                state.getNotifications(params);
              }
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