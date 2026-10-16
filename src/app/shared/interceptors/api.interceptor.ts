import {
  HttpInterceptorFn,
  HttpErrorResponse,
  HttpContextToken,
} from '@angular/common/http';
import {inject} from '@angular/core';
import {toObservable} from '@angular/core/rxjs-interop';
import {switchMap, throwError} from 'rxjs';
import {catchError, filter, take} from 'rxjs/operators';
import {TokenService} from "@shared/services/token-service";
import {EApiEndpoints} from "@models/api.models";
import {AuthStore} from "@auth/store/auth.store";
import {ProfileStore} from "@profile/store/profile.store";
import {SettingsService} from "@shared/services/settings.service";
import {ELang} from "@models/common.model";

export const IS_AUTH_REQUEST = new HttpContextToken<boolean>(() => false);

const ACCEPT_LANGUAGE: Record<ELang, string> = {
  [ELang.UA]: 'uk,en-US;q=0.9,en;q=0.8',
  [ELang.EN]: 'en-US,en;q=0.9,uk;q=0.8',
};

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.startsWith('assets/')) {
    return next(req);
  }

  const tokenService = inject(TokenService);
  const authStore = inject(AuthStore);
  const profileStore = inject(ProfileStore);
  const settingsService = inject(SettingsService);

  const refreshState$ = toObservable(authStore.refreshState);

  const lang = (profileStore.profile()?.language ?? settingsService.lang()) as ELang;
  const acceptLanguage = ACCEPT_LANGUAGE[lang] ?? ACCEPT_LANGUAGE[ELang.UA];

  const withHeaders = (token: string | null) =>
    req.clone({
      setHeaders: {
        'Accept-Language': acceptLanguage,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

  const authReq = withHeaders(tokenService.token());

  if (req.url.includes(EApiEndpoints.RefreshToken)) {
    return next(authReq);
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        if (authReq.context.get(IS_AUTH_REQUEST)) {
          return throwError(() => error);
        }

        authStore.refreshToken();

        return refreshState$.pipe(
          filter(state => state === 'success' || state === 'logout'),
          take(1),
          switchMap(state => {
            if (state === 'logout') return throwError(() => error);

            return next(withHeaders(tokenService.token()));
          })
        );
      }

      return throwError(() => error);
    })
  );
};