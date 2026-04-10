import {ERoutParams} from "@models/router.model";

export enum EApiEndpoints {
  CheckUser = 'auth/check-identifier',
  Login = 'auth/login',
  ForgotPassword = 'auth/forgot-password',
  RefreshToken = 'auth/refresh',
  CreatePassword = 'create-password',
  CompleteOnboarding = 'profile/complete-onboarding',

  // profile
  GetProfile = 'profile',
  UpdateProfile = 'profile',
  AddAvatar = 'profile/avatar',
  DeleteAvatar = 'profile/avatar',

  // users
  ListUsers = 'users',
  CreateUser = 'users',
  GetChangeUser = `users/:${ERoutParams.UserId}`,
  UpdateUser = `users/:${ERoutParams.UserId}`,
}

export type IApiUrlParams =  Record<string | number, string | number>;
export type IApiUrl =  EApiEndpoints | [EApiEndpoints, IApiUrlParams];

export interface IApiData<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  meta?: IPagination;
}

export interface IPagination {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
}

export const DEFAULT_PAGINATION = {
  currentPage: 0,
  lastPage: 0,
  perPage: 0,
  total: 0,
}