import {computed, inject} from '@angular/core';
import {Store} from '@ngrx/store';
import {patchState, signalStore, withComputed, withMethods, withState} from '@ngrx/signals';
import {rxMethod} from "@ngrx/signals/rxjs-interop";
import {pipe, switchMap, tap} from "rxjs";
import {IUser} from "@models/user.model";
import {UserService} from "@users/services/user.service";
import {IPagination} from "@models/api.models";
import {EUserPages, IUserUpdate} from "@users/models/user.model";
import {RouterActions} from "../../../store/router/actions";
import {EAppPages} from "@models/router.model";
import {HapticService} from "@shared/services/haptic.service";
import {ImpactStyle} from "@capacitor/haptics";
import {handleApiResponse, hasNextPage, mergePage} from "@shared/utils/handle-api-response";

export interface StudentsState {
  students: IUser[];
  studentsMeta: IPagination | null;
  studentsSearch: string;
  studentsLoading: boolean;
  student: IUser | null;
  studentLoading: boolean;
}

const initialState: StudentsState = {
  students: [],
  studentsMeta: null,
  studentsSearch: '',
  studentsLoading: false,
  student: null,
  studentLoading: false,
};

export const StudentsStore = signalStore(
  {
    providedIn: 'root'
  },
  withState(initialState),

  withComputed((state) => ({
    isReady: computed(() => !state.studentsLoading()),
    canLoadMore: computed(() => hasNextPage(state.studentsMeta())),
  })),

  withMethods((
    state,
    userService = inject(UserService),
  ) => {
    const fetchStudents = rxMethod<{ page: number; search: string; append: boolean }>(
      pipe(
        tap(() => patchState(state, {studentsLoading: true})),
        switchMap(({page, search, append}) => userService.getStudents(search, page).pipe(
          handleApiResponse<IUser[]>(
            (data, meta) => patchState(state, {
              students: mergePage(state.students(), data, append),
              studentsMeta: meta,
              studentsSearch: search,
              studentsLoading: false,
            }),
            () => patchState(state, {studentsLoading: false}),
          ),
        )),
      )
    );

    return {
      loadStudents(search: string = ''): void {
        fetchStudents({page: 1, search, append: false});
      },

      loadMoreStudents(): void {
        const meta = state.studentsMeta();
        if (state.studentsLoading() || !hasNextPage(meta)) return;
        fetchStudents({page: meta!.currentPage + 1, search: state.studentsSearch(), append: true});
      },

      refreshStudents(): void {
        fetchStudents({page: 1, search: state.studentsSearch(), append: false});
      },

      loadStudent: rxMethod<number>(
        pipe(
          tap(() => patchState(state, {studentLoading: true})),
          switchMap((studentId) => userService.getStudent(studentId).pipe(
            handleApiResponse<IUser>(
              (student) => patchState(state, {student, studentLoading: false}),
              () => patchState(state, {studentLoading: false}),
            ),
          )),
        )
      ),
    };
  }),

  withMethods((
    state,
    userService = inject(UserService),
    store = inject(Store),
    hapticService = inject(HapticService),
  ) => ({
    createStudent: rxMethod<IUserUpdate>(
      pipe(
        tap(() => patchState(state, {studentLoading: true})),
        switchMap((data) => userService.createStudent(data).pipe(
          handleApiResponse<IUser>(
            (student) => {
              patchState(state, {student, studentLoading: false});
              void hapticService.impact(ImpactStyle.Medium);
              state.loadStudents('');
              store.dispatch(RouterActions.goTo({path: [EAppPages.Users, EUserPages.ListUsers]}));
            },
            () => patchState(state, {studentLoading: false}),
          ),
        )),
      )
    ),

    updateStudent: rxMethod<IUserUpdate>(
      pipe(
        tap(() => patchState(state, {studentLoading: true})),
        switchMap((data) => userService.updateStudent(data).pipe(
          handleApiResponse<IUser>(
            (student) => {
              void hapticService.impact(ImpactStyle.Medium);
              patchState(state, {student, studentLoading: false});
            },
            () => patchState(state, {studentLoading: false}),
          ),
        )),
      )
    ),
  })),
);