import {inject, computed} from '@angular/core';
import {patchState, signalStore, withComputed, withMethods, withState} from '@ngrx/signals';
import {withEntities} from '@ngrx/signals/entities';
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import {pipe, switchMap, tap, catchError, of, forkJoin} from 'rxjs';
import {IUser} from "@models/user.model";
import {StudentService} from "@student/services/student.service";
import {IIncomingStudentLessons} from "@student/models/student.model";
import {IPurchase} from "@rates/models/rates.model";
import {IPagination} from "@models/api.models";
import {groupLessonsByWeek} from "@shared/utils/group-lessons-for-student.utils";
import {handleApiResponse, hasNextPage, mergePage} from "@shared/utils/handle-api-response";
import {TranslateService} from "@shared/services/translate.service";

export interface StudentState {
  isLoading: boolean;
  isLoaded: boolean;
  teachers: IUser[];
  lessons: IIncomingStudentLessons[];
  purchases: IPurchase[];
  purchasesMeta: IPagination | null;
  purchasesLoading: boolean;
}

const initialState: StudentState = {
  isLoading: false,
  isLoaded: false,
  teachers: [],
  lessons: [],
  purchases: [],
  purchasesMeta: null,
  purchasesLoading: false,
};

export const StudentStore = signalStore(
  {
    providedIn: 'root'
  },
  withState(initialState),
  withEntities<IUser>(),

  withComputed((
    state,
    translateService = inject(TranslateService),
  ) => ({
    isReady: computed(() => state.isLoaded()),
    groupedFutureLessons: computed(() => groupLessonsByWeek(state.lessons(), 'future', {
      thisWeek: translateService.instant('date.this-week'),
      nextWeek: translateService.instant('date.next-week'),
    })),
    groupedPastLessons: computed(() => groupLessonsByWeek(state.lessons(), 'past', {
      thisWeek: translateService.instant('date.this-week'),
      nextWeek: translateService.instant('date.next-week'),
    })),
    canLoadMorePurchases: computed(() => hasNextPage(state.purchasesMeta())),
  })),

  withMethods((
    state,
    studentService = inject(StudentService),
  ) => {
    const fetchPurchases = rxMethod<{ page: number; append: boolean }>(
      pipe(
        tap(() => patchState(state, {purchasesLoading: true})),
        switchMap(({page, append}) => studentService.getPurchases(page).pipe(
          handleApiResponse<IPurchase[]>(
            (data, meta) => patchState(state, {
              purchases: mergePage(state.purchases(), data, append),
              purchasesMeta: meta,
              purchasesLoading: false,
            }),
            () => patchState(state, {purchasesLoading: false}),
          ),
        )),
      )
    );

    return {
    getTeachers: rxMethod<void>(
      pipe(
        tap(() => patchState(state, {isLoading: true})),
        switchMap(() => studentService.getTeachers().pipe(
          tap((response) => {
            patchState(state, {
              teachers: response.data,
              isLoading: false
            });
          }),
          catchError((err) => {
            patchState(state, {isLoading: false});
            return of([]);
          })
        ))
      )
    ),

    getLessons: rxMethod<void>(
      pipe(
        tap(() => patchState(state, {isLoading: true})),
        switchMap(() =>
          forkJoin({
            groupLessons: studentService.getLessons(),
            individualLessons: studentService.getIndividualLessons()
          }).pipe(
            tap(({ groupLessons, individualLessons }) => {
              const allLessons = [
                ...(groupLessons?.data ?? []),
                ...(individualLessons?.data ?? [])
              ];

              patchState(state, {
                isLoading: false,
                isLoaded: true,
                lessons: allLessons
              });
            }),
            catchError((err) => {
              console.error(err);
              patchState(state, { isLoading: false });
              return of(null);
            })
          )
        )
      )
    ),

      getPurchases(): void {
        fetchPurchases({page: 1, append: false});
      },

      loadMorePurchases(): void {
        const meta = state.purchasesMeta();
        if (state.purchasesLoading() || !hasNextPage(meta)) return;
        fetchPurchases({page: meta!.currentPage + 1, append: true});
      },
    };
  })
);
