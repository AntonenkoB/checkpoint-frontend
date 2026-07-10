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

export const IS_AUTH_REQUEST = new HttpContextToken<boolean>(() => false);

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const authStore = inject(AuthStore);

  const refreshState$ = toObservable(authStore.refreshState);

  const token = tokenService.token();
  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

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

            const newToken = tokenService.token();
            return next(req.clone({ setHeaders: { Authorization: `Bearer ${newToken}` } }));
          })
        );
      }

      return throwError(() => error);
    })
  );
};