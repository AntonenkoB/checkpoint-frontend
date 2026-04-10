import {createFeatureSelector, createSelector} from '@ngrx/store';
import {AuthState} from "./reduser";

export const AUTH_FEATURE_KEY = 'auth';

export const selectAuthState = createFeatureSelector<AuthState>(AUTH_FEATURE_KEY);

export const selectAuthAll = createSelector(
  selectAuthState,
  (state: AuthState) => state
);

export const selectAuthLoading = createSelector(
  selectAuthState,
  (state: AuthState) => state.loading
);

export const selectAuthError = createSelector(
  selectAuthState,
  (state: AuthState) => state.error
);

export const selectAuthStep = createSelector(
  selectAuthState,
  (state: AuthState) => state.authStep
);

export const selectCheckUserFailure = createSelector(
  selectAuthState,
  (state: AuthState) => state.checkUserFailure
);

export const selectLoginFailure = createSelector(
  selectAuthState,
  (state: AuthState) => state.loginFailure
);

export const selectForgotPasswordFailure = createSelector(
  selectAuthState,
  (state: AuthState) => state.forgotPasswordFailure
);

