import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpContext, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {environment} from "@envs/environment";
import {IApiUrl} from "@models/api.models";
import {ToastService} from "@shared/services/toast.service";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly toastService = inject(ToastService)

  get<T>(path: IApiUrl, params?: Record<string, any>, context?: HttpContext): Observable<T> {
    return this.executeRequest<T>('GET', path, undefined, {params, context});
  }

  post<T, D = unknown>(path: IApiUrl, body?: D, context?: HttpContext): Observable<T> {
    return this.executeRequest<T>('POST', path, body, { context });
  }

  put<T, D = unknown>(path: IApiUrl, body: D, context?: HttpContext): Observable<T> {
    return this.executeRequest<T>('PUT', path, body, { context });
  }

  patch<T, D = unknown>(path: IApiUrl, body: D, context?: HttpContext): Observable<T> {
    return this.executeRequest<T>('PATCH', path, body, { context });
  }

  delete<T>(path: IApiUrl, context?: HttpContext): Observable<T> {
    return this.executeRequest<T>('DELETE', path, undefined, { context });
  }

  private executeRequest<T>(
      method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
      path: IApiUrl,
      body?: unknown,
      options?: { params?: Record<string, any>; context?: HttpContext }
  ): Observable<T> {
    const parsedPath = this.parseApiUrl(path);
    const url = `${environment.apiUrl}/${parsedPath}`;

    const { context, params } = options || {};
    const clonedParams = params ? structuredClone(params) : undefined;

    const requestOptions = {
      params: clonedParams,
      context: context
    };

    switch (method) {
      case 'GET':
        return this.http.get<T>(url, requestOptions).pipe(catchError(this.handleError));
      case 'POST':
        return this.http.post<T>(url, body, requestOptions).pipe(catchError(this.handleError));
      case 'PUT':
        return this.http.put<T>(url, body, {...requestOptions, params: {_method: 'PUT'}}).pipe(catchError(this.handleError));
      case 'PATCH':
        return this.http.patch<T>(url, body, requestOptions).pipe(catchError(this.handleError));
      case 'DELETE':
        return this.http.delete<T>(url, requestOptions).pipe(catchError(this.handleError));
    }
  }

  private handleError = (error: HttpErrorResponse): Observable<never> => {
    let errorMessage = '';
    //
    // console.log('error', error.error.errors)
    // const errors = error.error.errors
    // const errorKeys = Object.keys(error.error.errors)
    // console.log(error.error instanceof ErrorEvent)
    //
    // console.log(errors[errorKeys[0]][0])
    //
    // if (error.error instanceof ErrorEvent) {
    //   errorMessage = error.error.message;
    // } else {
    //   errorMessage = `${error.status}, message: ${error.message}`;
    // }
    //
    // console.log('error.error.message', error.error.message)

    if (error.status === 409) {
      this.toastService.error(error.error.message, 5000);
    }

    return throwError(() => new Error(error.error.message));
  }

  private parseApiUrl = (url: IApiUrl): string =>
    Array.isArray(url)
      ? Object.values(url[1]).reduce<string>((acc, val) => acc.replace(/:[^/]+/, String(val)), url[0] as string)
      : url as string;
}