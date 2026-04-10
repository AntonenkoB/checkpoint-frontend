import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, exhaustMap, forkJoin, from, map, of, switchMap, tap} from 'rxjs';
import {AuthActions} from "./actions";
import {AuthService} from "../services/auth-service";
import {RouterActions} from "../../../store/router/actions";
import {EAppPages} from "@models/router.model";
import {Action} from "@ngrx/store";
import {EAuthStep} from "../models/auth.model";
import {ApiResponseHelper} from "@shared/helpers/api.helper";
import {EUserPages, EUserRole} from "../../users/models/user.model";
import {EAuthPages} from "../models/router.model";
import {UserActions} from "../../users/store/actions";
import {TokenService} from "@shared/services/token-service";
import {SettingsService} from "@shared/services/settings.service";

@Injectable()
export class AuthEffects {
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
      switchMap(({ login }) =>
        this.authService.login(login).pipe(
          switchMap((response) => {
            if (!response?.success) {
              return of(AuthActions.loginFailure({ error: 'login.invalid-password' }));
            }

            const { token, user } = response.data;

            return forkJoin([
              this.tokenService.setToken(token),
              this.settingsService.updateSettings({
                theme: user.theme,
                repeat: login.repeat
              })
            ]).pipe(
              switchMap(() => {
                const actions: Action[] = [
                  AuthActions.loginSuccess({ user, token }),
                  UserActions.getProfile()
                ];

                if (!user.onboarding_completed) {
                  actions.push(AuthActions.authStep({ step: EAuthStep.CreatePassword }));
                } else {
                  const redirectPath = user.role === EUserRole.Student
                    ? [EAppPages.Users, EUserPages.Profile]
                    : [EAppPages.Users, EUserPages.ListUsers];

                  actions.push(RouterActions.navigate({ path: redirectPath }));
                }

                return from(actions);
              })
            );
          }),
          catchError(() => of(AuthActions.loginFailure({ error: 'login.invalid-password' })))
        )
      )
    )
  );

  createPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.createPassword),
      switchMap(({payload}) =>
        this.authService.createPassword(payload).pipe(
          switchMap((response) => {
            const actions: Action[] = [UserActions.getProfileSuccess({ profile: response.data.user })]

            if (response?.success && response.data.user.onboarding_completed) {
              response.data.user.role === EUserRole.Student
                ? actions.push(RouterActions.navigate({path: [EAppPages.Users, EUserPages.Profile]}))
                : actions.push(RouterActions.navigate({path: [EAppPages.Users, EUserPages.ListUsers]}))
            }

            return actions
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
            return of(AuthActions.authStep({step: EAuthStep.CreatePassword}))
          }),
          catchError((error) => of(AuthActions.forgotPasswordFailure({error: error.message})))
        )
      )
    )
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      switchMap(() => from(this.tokenService.clearToken()).pipe(
          map(() => RouterActions.navigate({ path: [EAppPages.Auth, EAuthPages.Login] })),
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
            return from(this.tokenService.setToken(res.data.token)).pipe(
              map(() => AuthActions.refreshTokenSuccess())
            )
          }),
          catchError(() => of(AuthActions.logout()))
        );
      })
    )
  );
}