import {createReducer, on} from '@ngrx/store';
import {EAuthStep} from '../models/auth.model';
import {AuthActions} from "./actions";

export interface AuthState {
  checkUserFailure: string | null;
  loginFailure: string | null;
  forgotPasswordFailure: string | null;
  loading: boolean;
  error: string | null;
  authStep: EAuthStep;
}

export const authState: AuthState = {
  checkUserFailure: null,
  loginFailure: null,
  forgotPasswordFailure: null,
  loading: false,
  error: null,
  authStep: EAuthStep.Identifier,
};

export const authReducer = createReducer(
  authState,

  on(AuthActions.checkUser, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AuthActions.checkUserSuccess, (state, {payload}) => ({
    ...state,
    payload,
    loading: false,
  })),
  on(AuthActions.checkUserFailure, (state, {error}) => ({
    ...state,
    checkUserFailure: error,
    loading: false,
  })),

  on(AuthActions.login, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AuthActions.loginFailure, (state, {error}) => ({
    ...state,
    loginFailure: error,
    loading: false,
  })),

  on(AuthActions.forgotPassword, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AuthActions.forgotPasswordSuccess, (state) => ({
    ...state,
    loading: false,
  })),
  on(AuthActions.forgotPasswordFailure, (state, {error}) => ({
    ...state,
    error,
    loading: false,
  })),
  on(AuthActions.authStep, (state, {step}) => ({
    ...state,
    authStep: step,
  })),
);