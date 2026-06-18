import {inject, computed} from '@angular/core';
import {Store} from '@ngrx/store';
import {patchState, signalStore, withComputed, withMethods, withState} from '@ngrx/signals';
import {rxMethod} from "@ngrx/signals/rxjs-interop";
import {catchError, of, pipe, switchMap, tap} from "rxjs";
import {withEntities} from "@ngrx/signals/entities";
import {IUser} from "@models/user.model";
import {UserService} from "@users/services/user.service";

export interface TeachersState {
  isLoading: boolean;
  teachersList: IUser[] | null;
  teacher: IUser | null;
}

const initialState: TeachersState = {
  isLoading: false,
  teachersList: null,
  teacher: null,
};

export const TeachersStore = signalStore(
  {
    providedIn: 'root'
  },
  withState(initialState),
  withEntities(),

  withComputed((state) => ({
    isReady: computed(() => !state.isLoading()),
  })),

  withMethods((state, userService = inject(UserService)) => ({
    loadTeachersList: rxMethod<void>(
      pipe(
        tap(() => patchState(state, {isLoading: true})),
        switchMap(() => userService.getTeachers().pipe(
          tap((response) => {
            if (response?.data) {
              patchState(state, {teachersList: response.data as IUser[], isLoading: false});
            } else {
              patchState(state, {isLoading: false});
            }
          }),
          catchError((err) => {
            patchState(state, {isLoading: false});
            return of([]);
          }),
        ))
      )
    ),

    loadTeacher: rxMethod<number>(
      pipe(
        tap(() => patchState(state, {isLoading: true})),
        switchMap((teacherId) => userService.getTeacher(teacherId).pipe(
          tap((response) => {
            if (response?.data) {
              patchState(state, {teacher: response.data, isLoading: false});
            } else {
              patchState(state, {isLoading: false});
            }
          }),
          catchError((err) => {
            console.error(err);
            patchState(state, {isLoading: false});
            return of([]);
          }),
        ))
      )
    ),
  })),
);
