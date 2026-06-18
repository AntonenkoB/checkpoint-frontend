import { Injectable } from "@angular/core";
import {Observable} from "rxjs";
import {EApiEndpoints, IApiData} from "@models/api.models";
import {IScheduleItem, IWeeklyScheduleItem} from "@schedule/models/schedule.model";
import {ApiService} from "@shared/services/api.service";

@Injectable({
  providedIn: "root",
})
export class ScheduleListService extends ApiService {
  public getScheduleList(from: string | string[], to: string | string[]): Observable<IApiData<IScheduleItem[]>> {
    return this.get<IApiData<IScheduleItem[]>>(EApiEndpoints.GetLessons, { from, to });
  }
}
