import {Injectable} from "@angular/core";
import {ApiService} from "@shared/services/api.service";
import {Observable} from "rxjs";
import {EApiEndpoints, IApiData} from "@models/api.models";
import {IRate} from "@rates/models/rates.model";
import {EDayOfWeek, IScheduleItem, ITimeRange, IWeeklyScheduleItem} from "@schedule/models/schedule.model";
import {getRangeDateTwoMonth} from "@shared/utils/date.utils";

@Injectable({
  providedIn: "root",
})
export class ScheduleService extends ApiService {
  public getWeekly(): Observable<IApiData<IWeeklyScheduleItem[]>> {
    return this.get<IApiData<IWeeklyScheduleItem[]>>(EApiEndpoints.GetScheduleWeek);
  }
  public getIndividualWeekly(): Observable<IApiData<IWeeklyScheduleItem[]>> {
    return this.get<IApiData<IWeeklyScheduleItem[]>>(EApiEndpoints.GetIndividualScheduleWeek);
  }

  public setWeekSlot(data: {day_of_week: EDayOfWeek, slots: ITimeRange[]}): Observable<IApiData<IRate>> {
    return this.post<IApiData<IRate>>(EApiEndpoints.AddScheduleWeek, data);
  }

  public setIndividualWeekSlot(data: {day_of_week: EDayOfWeek, slots: ITimeRange[]}): Observable<IApiData<IRate>> {
    return this.post<IApiData<IRate>>(EApiEndpoints.AddIndividualScheduleWeek, data);
  }

  public deleteWeekSlot(id: string): Observable<IApiData<IRate>> {
    return this.delete<IApiData<IRate>>([EApiEndpoints.DeleteScheduleWeek, {id}]);
  }

  public deleteIndividualWeekSlot(id: string): Observable<IApiData<IRate>> {
    return this.delete<IApiData<IRate>>([EApiEndpoints.DeleteIndividualScheduleWeek, {id}]);
  }

  public getSlots(from: string | string[], to: string | string[]): Observable<IApiData<IScheduleItem[]>> {
    return this.get<IApiData<IScheduleItem[]>>(EApiEndpoints.GetScheduleSlots, { from, to });
  }

  public getIndividualSlots(from: string | string[], to: string | string[]): Observable<IApiData<IScheduleItem[]>> {
    if (!from && !to) {
      const dateFrom = getRangeDateTwoMonth().from
      const dateTo = getRangeDateTwoMonth().to
      return this.get<IApiData<IScheduleItem[]>>(EApiEndpoints.GetIndividualScheduleSlots, { from: dateFrom, to: dateTo });
    }

    return this.get<IApiData<IScheduleItem[]>>(EApiEndpoints.GetIndividualScheduleSlots, { from, to });
  }

  public getOverviewSlots(from: string | string[], to: string | string[]): Observable<IApiData<IScheduleItem[]>> {
    if (!from && !to) {
      const dateFrom = getRangeDateTwoMonth().from
      const dateTo = getRangeDateTwoMonth().to
      return this.get<IApiData<IScheduleItem[]>>(EApiEndpoints.GetAllScheduleSlots, { from: dateFrom, to: dateTo });
    }

    return this.get<IApiData<IScheduleItem[]>>(EApiEndpoints.GetAllScheduleSlots, { from, to });
  }

  public setSlots(data: {date: string, slots: ITimeRange[]}): Observable<IApiData<IRate>> {
    return this.post<IApiData<IRate>>(EApiEndpoints.AddScheduleSlots, data);
  }

  public setIndividualSlots(data: {date: string, slots: ITimeRange[]}): Observable<IApiData<IRate>> {
    return this.post<IApiData<IRate>>(EApiEndpoints.AddIndividualScheduleSlots, data);
  }

  public deleteSlots(id: string): Observable<IApiData<IRate>> {
    return this.delete<IApiData<IRate>>([EApiEndpoints.DeleteScheduleSlots, {id}]);
  }

  public deleteIndividualSlots(id: string): Observable<IApiData<IRate>> {
    return this.delete<IApiData<IRate>>([EApiEndpoints.DeleteIndividualScheduleSlots, {id}]);
  }
}
