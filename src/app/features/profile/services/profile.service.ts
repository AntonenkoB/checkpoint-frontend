import { Injectable } from "@angular/core";
import {Observable} from "rxjs";
import {EApiEndpoints, IApiData} from "@models/api.models";
import {IUserProfile} from "@users/models/user.model";
import {IUser} from "@models/user.model";
import {ApiService} from "@shared/services/api.service";

@Injectable({
  providedIn: "root",
})
export class ProfileService extends ApiService {
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

  public deleteAccount(): Observable<IApiData<IUser>> {
    return this.delete(EApiEndpoints.DeleteAccount);
  }
}
