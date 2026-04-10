import {Action} from '@ngrx/store';
import {IApiData, IPagination} from "@models/api.models";

export class ApiResponseHelper {

  static handleSuccess<T>(
      response: IApiData<T>,
      onSuccess: (data: T, meta?: IPagination) => Action
  ): Action | null {

    return response.success && response.data ? onSuccess(response.data, response.meta) : null;
  }

  static handleError<T>(
      response: IApiData<T>,
      onError: (error: string) => Action
  ): Action {
    return onError(response.message || 'Сталася невідома помилка');
  }

  static handleResponse<T>(
      response: IApiData<T> & {meta?: IPagination},
      onSuccess: (data: T, meta?: IPagination) => Action,
      onError: (error: string) => Action
  ): Action {
    return response.success
        ? this.handleSuccess(response, onSuccess)!
        : this.handleError(response, onError);
  }
}