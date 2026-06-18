import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, exhaustMap, forkJoin, from, map, of, switchMap, withLatestFrom} from 'rxjs';
import {AuthActions} from "./actions";
import {AuthService} from "../services/auth-service";
import {RouterActions} from "../../../store/router/actions";
import {EAppPages} from "@models/router.model";
import {Action, Store} from "@ngrx/store";
import {EAuthStep, IResetPassword} from "../models/auth.model";
import {ApiResponseHelper} from "@shared/helpers/api.helper";
import {EHeaderMenu, EUserPages} from "../../users/models/user.model";
import {EUserRole} from "@models/user.model";
import {EAuthPages} from "../models/router.model";
import {TokenService} from "@shared/services/token-service";
import {SettingsService} from "@shared/services/settings.service";
import {AppState} from "@capacitor/app";
import {selectCodeConfirm} from "@auth/store/selectors";
import {ProfileStore} from "@profile/store/profile.store";

@Injectable()
export class AuthEffects {
  private store = inject<Store<AppState>>(Store);
  private profileStore = inject(ProfileStore);
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private tokenService = inject(TokenService);
  private settingsService = inject(SettingsService);

  checkUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.checkUser),
      switchMap(({payload}) =>
        this.authService.checkUser(payload).pipe(
          map((response) =>
            ApiResponseHelper.handleResponse(
              response,
              (data) => AuthActions.checkUserSuccess({payload: data}),
              (errors) => AuthActions.checkUserFailure({error: 'login.no-exist-user'})
            )
          ),
          catchError((error) => of(AuthActions.checkUserFailure({error: ' '})))
        )
      )
    )
  );

  checkUserSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.checkUserSuccess),
        switchMap(({payload}) => {
          const actions: Action[] = [];
          if (payload.exists) {
            actions.push(AuthActions.authStep({step: EAuthStep.Password}))
          } else {
            actions.push(AuthActions.checkUserFailure({error: 'login.no-exist-user'}))
          }

          return from(actions)
        }),
      ),
  );

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({login}) =>
        this.authService.login(login).pipe(
          switchMap((response) => {

            const {token, user} = response.data;

            return forkJoin([
              from(this.tokenService.setToken(token, login.repeat)),
              from(this.settingsService.updateSettings({
                theme: user.theme,
                repeat: login.repeat
              }))
            ]).pipe(
              switchMap(() => {
                const actions: Action[] = [
                  AuthActions.loginSuccess({user, token}),
                ];

                if (!user.onboarding_completed) {
                  actions.push(AuthActions.authStep({step: EAuthStep.CreatePassword}));
                } else {
                  this.profileStore.getProfile();

                  user.role === EUserRole.Student
                    ? actions.push(RouterActions.goTo({path: [EAppPages.Student]}))
                    : actions.push(RouterActions.goTo({
                      path: [EAppPages.Users, EUserPages.ListUsers],
                      extras: {queryParams: {tab: EHeaderMenu.Student}}
                    }))
                }

                return from(actions);
              })
            );
          }),
          catchError(() => of(AuthActions.loginFailure({error: 'login.invalid-password'})))
        )
      )
    )
  );

  createPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.createPassword),
      switchMap(({payload, repeat}) =>
        this.authService.createPassword(payload).pipe(
          switchMap((response) => {

            const {token, user} = response.data;

            return forkJoin([
              from(this.tokenService.setToken(token, repeat)),
              from(this.settingsService.updateSettings({
                theme: user.theme,
                repeat: repeat
              }))
            ]).pipe(
              switchMap(() => {
                const actions: Action[] = [];

                if (response?.success && response.data.user.onboarding_completed) {
                  response.data.user.role === EUserRole.Student
                    ? actions.push(RouterActions.goTo({path: [EAppPages.Auth, EAuthPages.Onboarding]}))
                    : actions.push(RouterActions.goTo({path: [EAppPages.Users, EUserPages.ListUsers]}))
                }

                return actions
              }),
            )
          }),
          catchError((error) => of(AuthActions.loginFailure({error: error.message})))
        )
      )
    )
  );

  forgotPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.forgotPassword),
      switchMap(({payload}) =>
        this.authService.forgotPassword(payload).pipe(
          switchMap(() => {
            return of(AuthActions.authStep({step: EAuthStep.CodeConfirm}))
          }),
          catchError((error) => of(AuthActions.forgotPasswordFailure({error: 'errors.check-email'})))
        )
      )
    )
  );

  codeConfirm$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.codeConfirm),
      switchMap(({payload}) =>
        this.authService.codeConfirm(payload).pipe(
          switchMap((res) => {
            return [
              AuthActions.codeConfirmSuccess({payload: res.data}),
              AuthActions.authStep({step: EAuthStep.ResetPassword})
            ]
          }),
          catchError((error) => of(AuthActions.codeConfirmFailure({error: 'errors.code-confirm'})))
        )
      )
    )
  );

  resetPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.resetPassword),
      withLatestFrom(this.store.select(selectCodeConfirm)),
      switchMap(([{ payload }, codeConfirmData]) => {
        const data = {...payload, reset_token: codeConfirmData} as IResetPassword;

         return this.authService.resetPassword(data).pipe(
            switchMap(() => {
              return of(AuthActions.authStep({step: EAuthStep.Identifier}))
            }),
            catchError((error) => of(AuthActions.forgotPasswordFailure({error: ''})))
          )
        }
      )
    )
  );


  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      switchMap(() =>
        forkJoin([
          from(this.tokenService.clearToken()),
          from(this.settingsService.clearSettings())
        ]).pipe(
          switchMap(() => [
            AuthActions.authStep({step: EAuthStep.Identifier}),
            RouterActions.goTo({path: [EAppPages.Auth, EAuthPages.Login]})
          ])
        )
      )
    )
  );

  AuthStep$ = createEffect(() =>
      this.actions$.pipe(
        ofType(AuthActions.authStep),
        map((data) => {
          return AuthActions.authStep({step: data.step});
        })
      ),
    {dispatch: false}
  );

  refreshToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.refreshToken),
      exhaustMap(() => {
        return this.authService.refreshToken().pipe(
          switchMap((res) => {
            const isRememberMe = this.settingsService.repeat();

            return from(this.tokenService.setToken(res.data.token, isRememberMe)).pipe(
              map(() => AuthActions.refreshTokenSuccess())
            )
          }),
          catchError(() => of(AuthActions.logout()))
        );
      })
    )
  );
}