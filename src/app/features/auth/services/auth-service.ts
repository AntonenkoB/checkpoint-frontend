import {Injectable} from '@angular/core';
import {ApiService} from "@shared/services/api.service";
import {Observable} from "rxjs";
import {EApiEndpoints, IApiData} from "@models/api.models";
import {
  IAuthLogin,
  IAuthResponse,
  ICheckUser,
  ICodeConfirm, ICodeConfirmResponse,
  IForgotPassword, IResetPassword,
  ISavePassword
} from "../models/auth.model";
import {HttpContext} from "@angular/common/http";
import {IS_AUTH_REQUEST} from "@shared/interceptors/api.interceptor";

@Injectable({
  providedIn: 'root',
})
export class AuthService extends ApiService {
  public checkUser(identifier: ICheckUser): Observable<IApiData<ICheckUser>> {
    return this.post<IApiData<ICheckUser>>(EApiEndpoints.CheckUser, identifier);
  }

  public login(data: IAuthLogin): Observable<{ data: IAuthResponse, success: boolean }> {
    const context = new HttpContext().set(IS_AUTH_REQUEST, true);

    return this.post(EApiEndpoints.Login, data, context);
  }

  public createPassword(data: ISavePassword): Observable<{ data: IAuthResponse, success: boolean }> {
    return this.post(EApiEndpoints.CompleteOnboarding, data);
  }

  public forgotPassword(data: IForgotPassword): Observable<{ data: ICodeConfirmResponse, success: boolean }> {
    return this.post(EApiEndpoints.ForgotPassword, data);
  }

  public codeConfirm(data: ICodeConfirm): Observable<IApiData<ICodeConfirmResponse>> {
    return this.post(EApiEndpoints.CheckIdentifier, data);
  }

  public resetPassword(data: IResetPassword): Observable<{ data: IAuthResponse, success: boolean }> {
    return this.post(EApiEndpoints.ResetPassword, data);
  }

  public refreshToken(): Observable<{ data: IAuthResponse, success: boolean }> {
    return this.post(EApiEndpoints.RefreshToken);
  }
}
