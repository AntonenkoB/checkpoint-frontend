import {inject, computed} from '@angular/core';
import {Store} from '@ngrx/store';
import {patchState, signalStore, withComputed, withMethods, withState} from '@ngrx/signals';
import {withEntities} from '@ngrx/signals/entities';
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import {pipe, switchMap, tap, catchError, of, filter} from 'rxjs';
import {selectQueryParam, selectRouteParam} from '../../../store/router/selectors';
import {EQueryParams, ERoutParams} from '@shared/models/router.model';
import {ISalary} from '../models/rates.model';
import {SalaryService} from "@rates/services/salary.service";
import {selectAllTeachers} from "@users/store/selectors";

export interface SalaryState {
  isLoading: boolean;
  allSalary: ISalary[];
  teacherSalary: ISalary[] | null;
}

const initialState: SalaryState = {
  isLoading: false,
  allSalary: [],
  teacherSalary: null,
};

export const SalaryStore = signalStore(
  {
    providedIn: 'root'
  },
  withState(initialState),
  withEntities<ISalary>(),

  withComputed((state, store = inject(Store)) => ({
    isReady: computed(() => !state.isLoading()),
    teacherId: store.selectSignal(selectRouteParam(ERoutParams.TeacherId)),
    month: store.selectSignal(selectQueryParam(EQueryParams.Month)),

    // remove after refactoring backend
    currentTeacher: computed(() => {
      const teachers = store.selectSignal(selectAllTeachers);
      const currentTeacherId = store.selectSignal(selectRouteParam(ERoutParams.TeacherId));
      return teachers().find((teacher) => teacher.id === +currentTeacherId()!);
    }),

  })),

  withMethods((state, salaryService = inject(SalaryService)) => ({

    getAllSalary: rxMethod<void>(
      pipe(
        tap(() => patchState(state, {isLoading: true})),
        switchMap(() => salaryService.getAllSalary(state.month()!).pipe(
          tap((salaries) => {
            patchState(state, {allSalary: salaries.data}, {isLoading: false});
          }),
          catchError((err) => {
            patchState(state, {isLoading: false});
            return of(null);
          })
        ))
      )
    ),

    getTeacherSalary: rxMethod<void>(
      pipe(
        filter(() => !!state.teacherId()),
        tap(() => patchState(state, {isLoading: true, teacherSalary: null})),
        switchMap(() => salaryService.getSalary(state.month()!, state.teacherId()!).pipe(
          tap((salary) => {
            patchState(state, {teacherSalary: salary.data}, {isLoading: false});
          }),
          catchError((err) => {
            console.error(err);
            patchState(state, {isLoading: false});
            return of(null);
          })
        ))
      )
    ),
  })),
);
