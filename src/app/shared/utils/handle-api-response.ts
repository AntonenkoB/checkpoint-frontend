import {Observable} from "rxjs";
import {tapResponse} from "@ngrx/operators";
import {IApiData, IPagination} from "@models/api.models";

/**
 * rxjs-оператор для обробки `IApiData<T>` усередині rxMethod.
 * На успіх кличе `onNext(data, meta)`, на помилку — `onError`.
 * Стор сам вирішує, у які ключі писати (patchState) — тож підходить
 * і для списків, і для одного об'єкта, з пагінацією чи без.
 */
export function handleApiResponse<T>(
  onNext: (data: T, meta: IPagination | null) => void,
  onError?: (err: unknown) => void,
) {
  return (source$: Observable<IApiData<T>>) =>
    source$.pipe(
      tapResponse({
        next: (res) => onNext(res.data, res.meta ?? null),
        error: (err) => {
          console.error(err);
          onError?.(err);
        },
      }),
    );
}

/** Пагінація: append наступної сторінки або заміна списку. */
export const mergePage = <T>(current: T[], incoming: T[], append: boolean): T[] =>
  append ? [...current, ...incoming] : incoming;

/** Пагінація: чи є наступна сторінка. */
export const hasNextPage = (meta: IPagination | null): boolean =>
  !!meta && meta.currentPage < meta.lastPage;