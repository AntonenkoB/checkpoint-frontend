import { Injectable } from "@angular/core";
import {ApiService} from "@shared/services/api.service";
import {Observable} from "rxjs";
import {EApiEndpoints, IApiData} from "@models/api.models";
import {ENotificationStatus, INotification, INotificationCount} from "../models/notifications.model";
import {EUserRole} from "@models/user.model";

@Injectable({
  providedIn: "root",
})
export class NotificationsService extends ApiService {
  public getNotifications(role: EUserRole, status?: ENotificationStatus, page = 1): Observable<IApiData<INotification[]>> {
    const params: Record<string, string | number> = { role, page };
    if (status) params['status'] = status;

    return this.get<IApiData<INotification[]>>(EApiEndpoints.GetNotifications, params);
  }

  public getNotificationCount(role: EUserRole): Observable<IApiData<INotificationCount>> {
    return this.get<IApiData<INotificationCount>>(EApiEndpoints.GetNotificationCount, {role});
  }

  public readNotification(id: number): Observable<IApiData<INotificationCount>> {
    return this.patch<IApiData<INotificationCount>>([EApiEndpoints.ReedNotification, {id: +id}], {});
  }

  public confirmNotification(id: number): Observable<IApiData<INotificationCount>> {
    return this.post<IApiData<INotificationCount>>([EApiEndpoints.ConfirmNotification, {id: +id}]);
  }

  public rejectNotification(id: number): Observable<IApiData<INotificationCount>> {
    return this.post<IApiData<INotificationCount>>([EApiEndpoints.RejectNotification, {id: +id}]);
  }

  public setDeviceTokens(token: string, platform: string): Observable<IApiData<unknown>> {
    return this.post<IApiData<unknown>>(EApiEndpoints.SetDeviceTokens, {token, platform});
  }

  public deleteDeviceTokens(token: string): Observable<IApiData<unknown>> {
    return this.post<IApiData<unknown>>(EApiEndpoints.DeleteDeviceTokens, {token});
  }
}