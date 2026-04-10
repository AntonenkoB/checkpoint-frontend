import {createFeatureSelector, createSelector} from '@ngrx/store';
import {UserState} from "./reduser";

export const USERS_FEATURE_KEY = 'users';

export const selectUserState = createFeatureSelector<UserState>(USERS_FEATURE_KEY);

export const selectAllUsers = createSelector(
  selectUserState,
  (state) => state.usersList || []
);

export const selectAllUsersPagination = createSelector(
  selectUserState,
  (state) => state.usersListPagination
);

export const selectAllTeachers = createSelector(
  selectUserState,
  (state) => state.teachersList || []
);

export const selectAllTeachersPagination = createSelector(
  selectUserState,
  (state) => state.teachersListPagination
);

export const selectAllStudents = createSelector(
  selectUserState,
  (state) => state.studentsList || []
);

export const selectAllStudentsPagination = createSelector(
  selectUserState,
  (state) => state.studentsListPagination
);

export const selectUser = createSelector(
  selectUserState,
  (state) => state.user
);

export const selectUserLoading = createSelector(
  selectUserState,
  (state) => state.loading
);

export const selectUserError = createSelector(
  selectUserState,
  (state) => state.error
);

export const selectProfile = createSelector(
  selectUserState,
  (state) => state.profile
);

export const selectProfileLoading = createSelector(
  selectUserState,
  (state) => state.loading
);