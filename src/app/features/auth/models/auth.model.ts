import {IUser} from "../../users/models/user.model";

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

export enum EAuthStep {
  Identifier = 'identifier',
  Password = 'password',
  CreatePassword = 'create-password',
  ForgotPassword = 'forgot-password',
}

export interface IAuthResponse {
  token: string;
  user: IUser;
  expires_in: number;
  refreshToken?: string | undefined;
}
