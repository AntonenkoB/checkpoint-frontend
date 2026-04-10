import {
  HttpInterceptorFn,
  HttpErrorResponse,
  HttpEvent,
  HttpRequest,
  HttpHandlerFn,
} from '@angular/common/http';
import {inject} from '@angular/core';
import {Observable, switchMap, throwError} from 'rxjs';
import {catchError, take} from 'rxjs/operators';
import {TokenService} from "@shared/services/token-service";
import {Store} from "@ngrx/store";
import {AuthActions} from "../../features/auth/store/actions";
import {Actions, ofType} from "@ngrx/effects";
import {EApiEndpoints} from "@models/api.models";

export const apiInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const tokenService = inject(TokenService);
  const store = inject(Store);
  const actions$ = inject(Actions);

  const token = tokenService.token();
  const authReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  if (req.url.includes(EApiEndpoints.RefreshToken)) {
    return next(authReq);
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        store.dispatch(AuthActions.refreshToken());

        return actions$.pipe(
          ofType(AuthActions.refreshTokenSuccess, AuthActions.logout),
          take(1),
          switchMap((action) => {
            if (action.type === AuthActions.logout.type) return throwError(() => error);

            const newToken = tokenService.token();
            return next(req.clone({ setHeaders: { Authorization: `Bearer ${newToken}` } }));
          })
        );
      }
      return throwError(() => error);
    })
  );
}