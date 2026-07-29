import {inject, computed} from '@angular/core';
import {patchState, signalStore, withComputed, withMethods, withState} from '@ngrx/signals';
import {withEntities} from '@ngrx/signals/entities';
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import {pipe, switchMap, tap, catchError, of, forkJoin} from 'rxjs';
import {IUser} from "@models/user.model";
import {StudentService} from "@student/services/student.service";
import {IIncomingStudentLessons} from "@student/models/student.model";
import {IPurchase} from "@rates/models/rates.model";
import {groupLessonsByWeek} from "@shared/utils/group-lessons-for-student.utils";
import {TranslateService} from "@shared/services/translate.service";

export interface StudentState {
  isLoading: boolean;
  teachers: IUser[];
  lessons: IIncomingStudentLessons[];
  purchases: IPurchase[];
}

const initialState: StudentState = {
  isLoading: false,
  teachers: [],
  lessons: [],
  purchases: [],
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
    isReady: computed(() => !state.isLoading() !== null),
    groupedFutureLessons: computed(() => groupLessonsByWeek(state.lessons(), 'future', {
      thisWeek: translateService.instant('date.this-week'),
      nextWeek: translateService.instant('date.next-week'),
    })),
    groupedPastLessons: computed(() => groupLessonsByWeek(state.lessons(), 'past', {
      thisWeek: translateService.instant('date.this-week'),
      nextWeek: translateService.instant('date.next-week'),
    }))
  })),

  withMethods((
    state,
    studentService = inject(StudentService),
  ) => ({
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

    getPurchases: rxMethod<void>(
      pipe(
        tap(() => patchState(state, {isLoading: true})),
        switchMap((teacherId) => studentService.getPurchases().pipe(
          tap((response) => {
            patchState(state, {isLoading: false, purchases: response.data});
          }),
          catchError((err) => {
            patchState(state, {isLoading: false});
            return of(null);
          })
        ))
      )
    ),
  }))
);
