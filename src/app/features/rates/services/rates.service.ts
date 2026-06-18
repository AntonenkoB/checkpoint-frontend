import { Injectable } from "@angular/core";
import {ApiService} from "@shared/services/api.service";
import {Observable} from "rxjs";
import {EApiEndpoints, IApiData} from "@models/api.models";
import {ICreateRate, IRate, IUpdateRate} from "@rates/models/rates.model";

@Injectable({
  providedIn: "root",
})
export class RatesService extends ApiService {
  public getAllRates(): Observable<IApiData<IRate>> {
    return this.get<IApiData<IRate>>(EApiEndpoints.AllRates);
  }

  public getRate(teacherId: string): Observable<IApiData<IRate[]>> {
    if (+teacherId > 0) {
      return this.get<IApiData<IRate[]>>(EApiEndpoints.GetRate, { teacher_id: teacherId });
    }

    return this.get<IApiData<IRate[]>>(EApiEndpoints.GetRate);

  }

  public createRate(data: ICreateRate): Observable<IApiData<IRate>> {
    return this.post<IApiData<IRate>>(EApiEndpoints.CreteRate, data);
  }

  public updateRate(data: {id: string, data: IUpdateRate}): Observable<IApiData<IRate>> {
    return this.patch<IApiData<IRate>>([EApiEndpoints.UpdateRates, {id: data.id}], data.data);
  }
}
