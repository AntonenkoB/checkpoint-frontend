import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {EApiEndpoints, IApiData} from "@models/api.models";
import {ApiService} from "@shared/services/api.service";
import {EUserRole, IUser, IUserProfile} from "../models/user.model";

@Injectable({
  providedIn: 'root',
})
export class UserService extends ApiService {
  public getAllUsers(role: EUserRole, page = 1): Observable<IApiData<IUser[]>> {
    return this.get<IApiData<IUser[]>>(EApiEndpoints.ListUsers, { role, page });
  }

  public createUser(data: IUserProfile): Observable<IApiData<IUser>> {
    return this.post<IApiData<IUser>>(EApiEndpoints.CreateUser, data);
  }

  public getUser(userId: number): Observable<IApiData<IUser>> {
    return this.get<IApiData<IUser>>([EApiEndpoints.GetChangeUser, { userId }]);
  }

  public updateUser(data: IUserProfile): Observable<IApiData<IUser>> {
    return this.put<IApiData<IUser>>(EApiEndpoints.UpdateUser, data);
  }

  public getProfile(): Observable<IApiData<IUser>> {
    return this.get<IApiData<IUser>>(EApiEndpoints.GetProfile);
  }

  public updateProfile(data: IUserProfile): Observable<IApiData<IUser>> {
    return this.put<IApiData<IUser>>(EApiEndpoints.UpdateProfile, data);
  }

  public addAvatar(data: FormData): Observable<IApiData<IUser>> {
    return this.post<IApiData<IUser>>(EApiEndpoints.AddAvatar, data);
  }

  public deleteAvatar(): Observable<IApiData<IUser>> {
    return this.delete<IApiData<IUser>>(EApiEndpoints.DeleteAvatar);
  }
}
