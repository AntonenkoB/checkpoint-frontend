import {Injectable} from "@angular/core";
import {ApiService} from "@shared/services/api.service";
import {Observable} from "rxjs";
import {EApiEndpoints, IApiData} from "@models/api.models";
import {ISalary} from "@rates/models/rates.model";

@Injectable({
  providedIn: "root",
})
export class SalaryService extends ApiService {
  public getAllSalary(month: string | string[] | undefined): Observable<IApiData<ISalary[]>> {
    return this.get<IApiData<ISalary[]>>(EApiEndpoints.Salary, {month});
  }

  public getSalary(month: string | string[] | undefined, teacherId: string): Observable<IApiData<ISalary[]>> {
    return this.get<IApiData<ISalary[]>>(EApiEndpoints.Salary, {month, teacher_id: teacherId });
  }
}
