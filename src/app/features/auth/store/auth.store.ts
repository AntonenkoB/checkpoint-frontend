import {computed, inject} from '@angular/core';
import {Store} from '@ngrx/store';
import {patchState, signalStore, withComputed, withMethods, withState} from '@ngrx/signals';
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import {catchError, exhaustMap, forkJoin, from, of, pipe, switchMap, tap} from 'rxjs';
import {map} from 'rxjs/operators';

import {AuthService} from '../services/auth-service';
import {
  IAuthLogin,
  ICheckUser,
  ICodeConfirm,
  IForgotPassword,
  IResetPassword,
  ISavePassword,
} from '../models/auth.model';
import {EAuthPages} from '../models/router.model';

import {RouterActions} from '../../../store/router/actions';
import {EAppPages} from '@models/router.model';
import {EUserRole} from '@models/user.model';
import {EHeaderMenu, EUserPages} from '../../users/models/user.model';

import {TokenService} from '@shared/services/token-service';
import {SettingsService} from '@shared/services/settings.service';
import {getHighestRole} from '@shared/permissions/role-priority';
import {ProfileStore} from '@profile/store/profile.store';
import {PushNotificationService} from "@notifacations/services/push-notification.service";

export type TRefreshState = 'idle' | 'pending' | 'success' | 'logout';

export interface AuthState {
  isLoading: boolean;
  error: string | null;
  identifier: string | null;
  email: string | null;
  resetToken: string | null;
  checkUserFailure: string | null;
  loginFailure: string | null;
  forgotPasswordFailure: string | null;
  codeConfirmFailure: string | null;
  refreshState: TRefreshState;
}

const initialState: AuthState = {
  isLoading: false,
  error: null,
  identifier: null,
  email: null,
  resetToken: null,
  checkUserFailure: null,
  loginFailure: null,
  forgotPasswordFailure: null,
  codeConfirmFailure: null,
  refreshState: 'idle',
};

export const AuthStore = signalStore(
  {
    providedIn: 'root',
  },
  withState(initialState),

  withComputed((state) => ({
    isReady: computed(() => !state.isLoading()),
  })),

  withMethods((
    state,
    authService = inject(AuthService),
    tokenService = inject(TokenService),
    settingsService = inject(SettingsService),
    profileStore = inject(ProfileStore),
    store = inject(Store),
    pushService = inject(PushNotificationService)
  ) => ({
    clearCheckUserFailure(): void {
      patchState(state, {checkUserFailure: null});
    },

    clearLoginFailure(): void {
      patchState(state, {loginFailure: null});
    },

    clearForgotPasswordFailure(): void {
      patchState(state, {forgotPasswordFailure: null});
    },

    checkUser: rxMethod<ICheckUser>(
      pipe(
        tap((payload) => patchState(state, {
          isLoading: true,
          error: null,
          checkUserFailure: null,
          identifier: payload.identifier,
        })),
        switchMap((payload) =>
          authService.checkUser(payload).pipe(
            tap((response) => {
              if (response?.success && response.data?.exists) {
                patchState(state, {isLoading: false});
                store.dispatch(RouterActions.goTo({path: [EAppPages.Auth, EAuthPages.LoginPassword]}));
              } else {
                patchState(state, {isLoading: false, checkUserFailure: 'login.no-exist-user'});
              }
            }),
            catchError((err) => {
              console.error(err);
              patchState(state, {isLoading: false, checkUserFailure: ' '});
              return of(null);
            }),
          ),
        ),
      ),
    ),

    login: rxMethod<IAuthLogin>(
      pipe(
        tap(() => patchState(state, {isLoading: true, error: null, loginFailure: null})),
        switchMap((login) =>
          authService.login(login).pipe(
            switchMap((response) => {
              const {token, user} = response.data;

              return forkJoin([
                from(tokenService.setToken(token, login.repeat)),
                from(settingsService.updateSettings({theme: user.theme, repeat: login.repeat})),
              ]).pipe(
                tap(() => {
                  patchState(state, {isLoading: false});

                  if (!user.onboarding_completed) {
                    store.dispatch(RouterActions.goTo({path: [EAppPages.Auth, EAuthPages.LoginCreatePassword]}));
                    return;
                  }

                  profileStore.getProfile();
                  void pushService.init();
                  const highestRole = getHighestRole(user.roles);

                  highestRole === EUserRole.Student
                    ? store.dispatch(RouterActions.goTo({path: [EAppPages.Student]}))
                    : store.dispatch(RouterActions.goTo({
                      path: [EAppPages.Users, EUserPages.ListUsers],
                      extras: {queryParams: {tab: EHeaderMenu.Schedule}},
                    }));
                }),
              );
            }),
            catchError((err) => {
              console.error(err);
              patchState(state, {isLoading: false, loginFailure: 'login.invalid-password'});
              return of(null);
            }),
          ),
        ),
      ),
    ),

    createPassword: rxMethod<{payload: ISavePassword; repeat: boolean}>(
      pipe(
        tap(() => patchState(state, {isLoading: true, error: null})),
        switchMap(({payload, repeat}) =>
          authService.createPassword(payload).pipe(
            switchMap((response) => {
              const {token, user} = response.data;

              return forkJoin([
                from(tokenService.setToken(token, repeat)),
                from(settingsService.updateSettings({theme: user.theme, repeat})),
              ]).pipe(
                tap(() => {
                  patchState(state, {isLoading: false});

                  if (response?.success && user.onboarding_completed) {
                    profileStore.getProfile();
                    const highestRole = getHighestRole(user.roles);

                    highestRole === EUserRole.Student
                      ? store.dispatch(RouterActions.goTo({path: [EAppPages.Auth, EAuthPages.Onboarding]}))
                      : store.dispatch(RouterActions.goTo({
                        path: [EAppPages.Users, EUserPages.ListUsers],
                        extras: {queryParams: {tab: EHeaderMenu.Schedule}},
                      }));
                  }
                }),
              );
            }),
            catchError((err) => {
              console.error(err);
              patchState(state, {isLoading: false, loginFailure: err?.message ?? null});
              return of(null);
            }),
          ),
        ),
      ),
    ),

    forgotPassword: rxMethod<IForgotPassword>(
      pipe(
        tap((payload) => patchState(state, {
          isLoading: true,
          error: null,
          forgotPasswordFailure: null,
          email: payload.email,
        })),
        switchMap((payload) =>
          authService.forgotPassword(payload).pipe(
            tap(() => {
              patchState(state, {isLoading: false});
              store.dispatch(RouterActions.goTo({path: [EAppPages.Auth, EAuthPages.LoginCodeConfirm]}));
            }),
            catchError((err) => {
              console.error(err);
              patchState(state, {isLoading: false, forgotPasswordFailure: 'errors.check-email'});
              return of(null);
            }),
          ),
        ),
      ),
    ),

    codeConfirm: rxMethod<ICodeConfirm>(
      pipe(
        tap((payload) => patchState(state, {
          isLoading: true,
          error: null,
          codeConfirmFailure: null,
          email: payload.email,
        })),
        switchMap((payload) =>
          authService.codeConfirm(payload).pipe(
            tap((response) => {
              patchState(state, {isLoading: false, resetToken: response.data.reset_token});
              store.dispatch(RouterActions.goTo({path: [EAppPages.Auth, EAuthPages.LoginResetPassword]}));
            }),
            catchError((err) => {
              console.error(err);
              patchState(state, {isLoading: false, codeConfirmFailure: 'errors.code-confirm'});
              return of(null);
            }),
          ),
        ),
      ),
    ),

    resetPassword: rxMethod<Omit<IResetPassword, 'reset_token'>>(
      pipe(
        tap(() => patchState(state, {isLoading: true, error: null})),
        switchMap((payload) => {
          const data: IResetPassword = {...payload, reset_token: state.resetToken() ?? ''};

          return authService.resetPassword(data).pipe(
            tap(() => {
              patchState(state, {isLoading: false});
              store.dispatch(RouterActions.goTo({path: [EAppPages.Auth, EAuthPages.LoginIdentifier]}));
            }),
            catchError((err) => {
              console.error(err);
              patchState(state, {isLoading: false, forgotPasswordFailure: ''});
              return of(null);
            }),
          );
        }),
      ),
    ),

    logout: rxMethod<void>(
      pipe(
        switchMap(() =>
          forkJoin([
            from(tokenService.clearToken()),
            from(settingsService.clearSettings()),
            from(profileStore.clearActiveRole()),
          ]).pipe(
            tap(() => {
              patchState(state, {...initialState, refreshState: 'logout'});
              pushService.deleteToken();
              store.dispatch(RouterActions.goTo({path: [EAppPages.Auth, EAuthPages.LoginIdentifier]}));
            }),
          ),
        ),
      ),
    ),

    refreshToken: rxMethod<void>(
      pipe(
        tap(() => patchState(state, {refreshState: 'pending'})),
        exhaustMap(() =>
          authService.refreshToken().pipe(
            switchMap((res) => {
              const isRememberMe = settingsService.repeat();
              return from(tokenService.setToken(res.data.token, isRememberMe)).pipe(
                tap(() => patchState(state, {refreshState: 'success'})),
                map(() => null),
              );
            }),
            catchError((err) => {
              console.error(err);
              patchState(state, {...initialState, refreshState: 'logout'});
              store.dispatch(RouterActions.goTo({path: [EAppPages.Auth, EAuthPages.LoginIdentifier]}));
              return of(null);
            }),
          ),
        ),
      ),
    ),
  })),
);