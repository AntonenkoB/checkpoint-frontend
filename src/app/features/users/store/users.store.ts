import {computed, inject} from '@angular/core';
import {Store} from '@ngrx/store';
import {patchState, signalStore, withComputed, withMethods, withState} from '@ngrx/signals';
import {rxMethod} from "@ngrx/signals/rxjs-interop";
import {pipe, switchMap, tap} from "rxjs";
import {IUser, EUserRole} from "@models/user.model";
import {UserService} from "@users/services/user.service";
import {IPagination} from "@models/api.models";
import {EUserPages, IUserUpdate} from "@users/models/user.model";
import {RouterActions} from "../../../store/router/actions";
import {EAppPages} from "@models/router.model";
import {EAuthPages} from "../../auth/models/router.model";
import {HapticService} from "@shared/services/haptic.service";
import {ImpactStyle} from "@capacitor/haptics";
import {getHighestRole} from "@shared/permissions/role-priority";
import {handleApiResponse, hasNextPage, mergePage} from "@shared/utils/handle-api-response";

export interface UsersState {
  usersList: IUser[];
  usersMeta: IPagination | null;
  usersRole: EUserRole | null;
  usersSearch: string;
  usersLoading: boolean;
  teachersList: IUser[];
  teachersMeta: IPagination | null;
  teachersLoading: boolean;
  user: IUser | null;
  userLoading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  usersList: [],
  usersMeta: null,
  usersRole: null,
  usersSearch: '',
  usersLoading: false,
  teachersList: [],
  teachersMeta: null,
  teachersLoading: false,
  user: null,
  userLoading: false,
  error: null,
};

export const UsersStore = signalStore(
  {
    providedIn: 'root'
  },
  withState(initialState),

  withComputed((state) => ({
    isReady: computed(() => !state.usersLoading()),
    canLoadMore: computed(() => hasNextPage(state.usersMeta())),
  })),

  withMethods((
    state,
    userService = inject(UserService),
    store = inject(Store),
  ) => {
    const fetchUsers = rxMethod<{ role: EUserRole; page: number; search: string; append: boolean }>(
      pipe(
        tap(() => patchState(state, {usersLoading: true, error: null})),
        switchMap(({role, page, search, append}) => userService.getAllUsers(role, page, search).pipe(
          handleApiResponse<IUser[]>(
            (data, meta) => patchState(state, {
              usersList: mergePage(state.usersList(), data, append),
              usersMeta: meta,
              usersRole: role,
              usersSearch: search,
              usersLoading: false,
            }),
            () => {
              patchState(state, {usersLoading: false});
              store.dispatch(RouterActions.goTo({path: [EAppPages.Auth, EAuthPages.LoginIdentifier]}));
            },
          ),
        )),
      )
    );

    const fetchTeachers = rxMethod<{ page: number; append: boolean }>(
      pipe(
        tap(() => patchState(state, {teachersLoading: true})),
        switchMap(({page, append}) => userService.getAllUsers(EUserRole.Teacher, page).pipe(
          handleApiResponse<IUser[]>(
            (data, meta) => patchState(state, {
              teachersList: mergePage(state.teachersList(), data, append),
              teachersMeta: meta,
              teachersLoading: false,
            }),
            () => patchState(state, {teachersLoading: false}),
          ),
        )),
      )
    );

    return {
      loadUsers(role: EUserRole, page: number = 1, search: string = ''): void {
        fetchUsers({role, page, search, append: false});
      },

      loadMoreUsers(): void {
        const meta = state.usersMeta();
        const role = state.usersRole();
        if (state.usersLoading() || !role || !hasNextPage(meta)) return;
        fetchUsers({role, page: meta!.currentPage + 1, search: state.usersSearch(), append: true});
      },

      loadTeachers(page: number = 1): void {
        fetchTeachers({page, append: false});
      },

      loadUser: rxMethod<number>(
        pipe(
          tap(() => patchState(state, {userLoading: true})),
          switchMap((userId) => userService.getUser(userId).pipe(
            handleApiResponse<IUser>(
              (user) => patchState(state, {user, userLoading: false}),
              () => patchState(state, {userLoading: false}),
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
    createUser: rxMethod<IUserUpdate>(
      pipe(
        tap(() => patchState(state, {userLoading: true})),
        switchMap((payload) => userService.createUser(payload).pipe(
          handleApiResponse<IUser>(
            (user) => {
              patchState(state, {user, userLoading: false});
              void hapticService.impact(ImpactStyle.Medium);
              const highestRole = getHighestRole(user.roles)!;
              state.loadUsers(highestRole);
              store.dispatch(RouterActions.goTo({path: [EAppPages.Users, EUserPages.ListUsers]}));
            },
            () => patchState(state, {userLoading: false}),
          ),
        )),
      )
    ),

    updateUser: rxMethod<IUserUpdate>(
      pipe(
        tap(() => patchState(state, {userLoading: true})),
        switchMap((payload) => userService.updateUser(payload).pipe(
          handleApiResponse<IUser>(
            (user) => {
              void hapticService.impact(ImpactStyle.Medium);
              patchState(state, {user, userLoading: false});
            },
            () => patchState(state, {userLoading: false}),
          ),
        )),
      )
    ),

    deleteUser: rxMethod<string>(
      pipe(
        tap(() => patchState(state, {userLoading: true})),
        switchMap((userId) => userService.deleteUser(userId).pipe(
          handleApiResponse<IUser>(
            () => {
              patchState(state, {userLoading: false});
              state.loadUsers(EUserRole.Student);
              store.dispatch(RouterActions.goTo({path: [EAppPages.Users, EUserPages.ListUsers]}));
            },
            () => patchState(state, {userLoading: false}),
          ),
        )),
      )
    ),
  })),
);