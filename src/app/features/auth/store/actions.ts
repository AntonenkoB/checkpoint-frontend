import {createActionGroup, emptyProps, props} from '@ngrx/store';
import {
  EAuthStep,
  IAuthLogin,
  ICheckUser,
  IForgotPassword,
  ISavePassword,
} from "../models/auth.model";

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    checkUser: props<{ payload: ICheckUser }>(),
    checkUserSuccess: props<{ payload: ICheckUser }>(),
    checkUserFailure: props<{ error: string | null }>(),

    login: props<{ login: IAuthLogin }>(),
    loginSuccess: props<{ user: any; token: string }>(),
    loginFailure: props<{ error: string | null }>(),

    logout: emptyProps(),

    createPassword: props<{ payload: ISavePassword }>(),

    forgotPassword: props<{ payload: IForgotPassword }>(),
    forgotPasswordSuccess: emptyProps(),
    forgotPasswordFailure: props<{ error: string }>(),

    refreshToken: emptyProps(),
    refreshTokenSuccess: emptyProps(),

    authStep: props<{ step: EAuthStep }>(),
  }
});