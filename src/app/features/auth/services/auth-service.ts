import {Injectable} from '@angular/core';
import {ApiService} from "@shared/services/api.service";
import {Observable} from "rxjs";
import {EApiEndpoints, IApiData} from "@models/api.models";
import {IAuthLogin, IAuthResponse, ICheckUser, IForgotPassword, ISavePassword} from "../models/auth.model";

@Injectable({
  providedIn: 'root',
})
export class AuthService extends ApiService {
  public checkUser(identifier: ICheckUser): Observable<IApiData<ICheckUser>> {
    return this.post<IApiData<ICheckUser>>(EApiEndpoints.CheckUser, identifier);
  }

  public login(data: IAuthLogin): Observable<{ data: IAuthResponse, success: boolean }> {
    return this.post(EApiEndpoints.Login, data);
  }

  public createPassword(data: ISavePassword): Observable<{ data: IAuthResponse, success: boolean }> {
    return this.post(EApiEndpoints.CompleteOnboarding, data);
  }

  public forgotPassword(data: IForgotPassword): Observable<{ data: IAuthResponse, success: boolean }> {
    return this.post(EApiEndpoints.ForgotPassword, data);
  }

  public refreshToken(): Observable<{ data: IAuthResponse, success: boolean }> {
    return this.post(EApiEndpoints.RefreshToken);
  }
}
