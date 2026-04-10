import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {environment} from "@envs/environment";
import {IApiUrl} from "@models/api.models";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly http = inject(HttpClient);

  get<T>(path: IApiUrl, params?: Record<string, any>): Observable<T> {
    return this.executeRequest<T>('GET', path, undefined, {params});
  }

  post<T, D = unknown>(path: IApiUrl, body?: D): Observable<T> {
    return this.executeRequest<T>('POST', path, body);
  }

  put<T, D = unknown>(path: IApiUrl, body: D): Observable<T> {
    return this.executeRequest<T>('PUT', path, body);
  }

  delete<T>(path: IApiUrl): Observable<T> {
    return this.executeRequest<T>('DELETE', path);
  }

  private executeRequest<T>(
      method: 'GET' | 'POST' | 'PUT' | 'DELETE',
      path: IApiUrl,
      body?: unknown,
      options?: Record<string, any>
  ): Observable<T> {
    const parsedPath = this.parseApiUrl(path);
    const url = `${environment.apiUrl}/${parsedPath}`;
    const optionsStructured = structuredClone(options);

    switch (method) {
      case 'GET':
        return this.http.get<T>(url, optionsStructured).pipe(catchError(this.handleError));
      case 'POST':
        return this.http.post<T>(url, body, optionsStructured).pipe(catchError(this.handleError));
      case 'PUT':
        return this.http.put<T>(url, body, {...options, params: {_method: 'PUT'}}).pipe(catchError(this.handleError));
      case 'DELETE':
        return this.http.delete<T>(url, optionsStructured).pipe(catchError(this.handleError));
    }
  }

  private handleError = (error: HttpErrorResponse): Observable<never> => {
    let errorMessage = '';

    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `${error.status}, message: ${error.message}`;
    }

    return throwError(() => new Error(errorMessage));
  }

  private parseApiUrl = (url: IApiUrl): string =>
    Array.isArray(url)
      ? Object.values(url[1]).reduce<string>((acc, val) => acc.replace(/:[^/]+/, String(val)), url[0] as string)
      : url as string;
}