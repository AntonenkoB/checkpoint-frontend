import {IUser} from "@models/user.model";

export interface ICheckUser {
  identifier: string;
  exists?: boolean;
}

export interface IAuthLogin {
  identifier: string;
  password: string;
  repeat: boolean;
}

export interface ISavePassword {
  password: string;
  password_confirmation: string;
}

export interface IForgotPassword {
  email: string;
}

export interface ICodeConfirm {
  email: string;
  code: string;
}

export interface ICodeConfirmResponse {
  reset_token: string;
}

export interface IResetPassword {
  reset_token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export enum EAuthStep {
  Identifier = 'identifier',
  Password = 'password',
  CreatePassword = 'create-password',
  ForgotPassword = 'forgot-password',
  CodeConfirm = 'code-confirm',
  ResetPassword = 'reset-password',
}

export interface IAuthResponse {
  token: string;
  user: IUser;
  expires_in: number;
  refreshToken?: string | undefined;
}
