import {inject, computed} from '@angular/core';
import {Store} from '@ngrx/store';
import {patchState, signalStore, withComputed, withMethods, withState} from '@ngrx/signals';
import {rxMethod} from "@ngrx/signals/rxjs-interop";
import {catchError, of, pipe, switchMap, tap} from "rxjs";
import {withEntities} from "@ngrx/signals/entities";
import {IUser} from "@models/user.model";
import {UserService} from "@users/services/user.service";
import {IPagination} from "@models/api.models";
import {EUserPages, IUserUpdate} from "@users/models/user.model";
import {RouterActions} from "../../../store/router/actions";
import {EAppPages} from "@models/router.model";
import {HapticService} from "@shared/services/haptic.service";
import {ImpactStyle} from "@capacitor/haptics";

export interface StudentsState {
  isLoading: boolean;
  studentsList: IUser[] | null;
  studentsListMeta: IPagination | null;
  student: IUser | null;
}

const initialState: StudentsState = {
  isLoading: false,
  studentsList: null,
  studentsListMeta: null,
  student: null,
};

export const StudentsStore = signalStore(
  {
    providedIn: 'root'
  },
  withState(initialState),
  withEntities(),
  withComputed((state, store = inject(Store)) => ({
    isReady: computed(() => !state.isLoading()),
  })),

  withMethods((
    state,
    userService = inject(UserService),
  ) => ({
    loadStudentsList: rxMethod<string>(
      pipe(
        tap(() => patchState(state, {isLoading: true})),
        switchMap((search) => userService.getStudentsList(search).pipe(
          tap((response) => {
            if (response?.data) {
              patchState(state, {
                studentsList: response.data as IUser[],
                studentsListMeta: response.meta as IPagination,
                isLoading: false});
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

    loadStudent: rxMethod<number>(
      pipe(
        tap(() => patchState(state, {isLoading: true})),
        switchMap((studentId) => userService.getStudent(studentId).pipe(
          tap((response) => {
            if (response?.data) {
              patchState(state, {student: response.data, isLoading: false});
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

  withMethods((
    state,
    userService = inject(UserService),
    store = inject(Store),
    hapticService = inject(HapticService),
  ) => ({
    createStudent: rxMethod<IUserUpdate>(
      pipe(
        tap(() => patchState(state, {isLoading: true})),
        switchMap((data) => userService.createStudent(data).pipe(
          tap((response) => {
            if (response?.data) {
              patchState(state, {student: response.data, isLoading: false});
            } else {
              patchState(state, {isLoading: false});
            }

            void hapticService.impact(ImpactStyle.Medium);
            state.loadStudentsList('');
            store.dispatch(RouterActions.goTo({path: [EAppPages.Users, EUserPages.ListUsers]}))
          }),
          catchError((err) => {
            console.error(err);
            patchState(state, {isLoading: false});
            return of([]);
          }),
        ))
      )
    ),

    updateStudent: rxMethod<IUserUpdate>(
      pipe(
        tap(() => patchState(state, {isLoading: true})),
        switchMap((data) => userService.updateStudent(data).pipe(
          tap((response) => {
            if (response?.data) {
              void hapticService.impact(ImpactStyle.Medium);
              patchState(state, {student: response.data, isLoading: false});
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
