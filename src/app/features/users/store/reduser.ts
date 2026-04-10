import {createReducer, on} from '@ngrx/store';
import {UserActions} from './actions';
import {IUser} from "../models/user.model";
import {DEFAULT_PAGINATION, IPagination} from "@models/api.models";

export interface UserState {
  usersList: IUser[] | null;
  usersListPagination: IPagination;
  teachersList: IUser[] | null;
  teachersListPagination: IPagination;
  studentsList: IUser[] | null;
  studentsListPagination: IPagination;
  user: IUser | null;
  profile: IUser | null;
  loading: boolean;
  error: string | null;
}

export const initialUserState: UserState = {
  usersList: null,
  usersListPagination: DEFAULT_PAGINATION,
  teachersList: null,
  teachersListPagination: DEFAULT_PAGINATION,
  studentsList: null,
  studentsListPagination: DEFAULT_PAGINATION,
  user: null,
  profile: null,
  loading: false,
  error: null,
};

export const userReducer = createReducer(
  initialUserState,

  // All users
  on(UserActions.allUsers, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(UserActions.allUsersSuccess, (state, {usersList, pagination}) => ({
    ...state,
    usersList,
    usersListPagination: pagination ?? DEFAULT_PAGINATION,
    loading: false,
  })),
  on(UserActions.allUsersFailure, (state, {error}) => ({
    ...state,
    error,
    loading: false,
  })),

  // All teachers
  on(UserActions.allTeachers, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(UserActions.allTeachersSuccess, (state, {teachersList, pagination}) => ({
    ...state,
    teachersList,
    teachersListPagination: pagination ?? DEFAULT_PAGINATION,
    loading: false,
  })),
  on(UserActions.allTeachersFailure, (state, {error}) => ({
    ...state,
    error,
    loading: false,
  })),

  // All students
  on(UserActions.allStudents, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(UserActions.allStudentsSuccess, (state, {studentsList, pagination}) => ({
    ...state,
    studentsList,
    teachersListPagination: pagination ?? DEFAULT_PAGINATION,
    loading: false,
  })),
  on(UserActions.allStudentsFailure, (state, {error}) => ({
    ...state,
    error,
    loading: false,
  })),

  // Create user
  on(UserActions.createUser, (state) => ({
    ...state,
    loading: true,
  })),
  on(UserActions.createUserSuccess, (state, {user}) => ({
    ...state,
    users: state.usersList ? [...state.usersList, user] : [user],
    loading: false,
  })),
  on(UserActions.createUserFailure, (state, {error}) => ({
    ...state,
    error,
    loading: false,
  })),

  // Update user
  on(UserActions.updateUser, (state) => ({
    ...state,
    loading: true,
  })),
  on(UserActions.updateUserSuccess, (state, {user}) => ({
    ...state,
    users: state.usersList
      ? state.usersList.map((u) => (u.id === user.id ? user : u))
      : null,
    loading: false,
  })),
  on(UserActions.updateUserFailure, (state, {error}) => ({
    ...state,
    error,
    loading: false,
  })),

  // Delete user
  on(UserActions.deleteUser, (state) => ({
    ...state,
    loading: true,
  })),
  on(UserActions.deleteUserSuccess, (state, {userId}) => ({
    ...state,
    users: state.usersList ? state.usersList.filter((u) => u.id !== +userId) : null,
    loading: false,
  })),
  on(UserActions.deleteUserFailure, (state, {error}) => ({
    ...state,
    error,
    loading: false,
  })),

  // get user
  on(UserActions.getUser, (state) => ({
    ...state,
    loading: true,
  })),
  on(UserActions.getUserSuccess, (state, {user}) => ({
    ...state,
    user,
    loading: false,
  })),
  on(UserActions.getUserFailure, (state, {error}) => ({
    ...state,
    error,
    loading: false,
  })),

  // get Profile
  on(UserActions.getProfile, (state) => ({
    ...state,
    loading: true,
  })),
  on(UserActions.getProfileSuccess, (state, {profile}) => ({
    ...state,
    profile,
    loading: false,
  })),
  on(UserActions.getProfileFailure, (state, {error}) => ({
    ...state,
    error,
    loading: false,
  })),
);


