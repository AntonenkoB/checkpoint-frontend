import {inject, Injectable} from "@angular/core";
import {ApiService} from "@shared/services/api.service";
import {Observable} from "rxjs";
import {EApiEndpoints, IApiData} from "@models/api.models";
import {IUser} from "@models/user.model";
import {IIncomingStudentLessons} from "@student/models/student.model";
import {DatePipe} from "@angular/common";
import {IPurchase} from "@rates/models/rates.model";

@Injectable({
  providedIn: "root",
})
export class StudentService extends ApiService {
  private datePipe = inject(DatePipe);

  public getTeachers(): Observable<IApiData<IUser[]>> {
    return this.get<IApiData<IUser[]>>(EApiEndpoints.GetTeachers);
  }

  public getLessons(): Observable<IApiData<IIncomingStudentLessons[]>> {
    const fromCustom = this.datePipe.transform(new Date(), 'yyyy-MM-dd') as string;
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 2);
    const toCustom = this.datePipe.transform(futureDate, 'yyyy-MM-dd') as string;

    const data = {
      from: fromCustom,
      to: toCustom
    }
    return this.get<IApiData<IIncomingStudentLessons[]>>(EApiEndpoints.GetStudentLessons);
  }

  public getIndividualLessons(): Observable<IApiData<IIncomingStudentLessons[]>> {
    const fromCustom = this.datePipe.transform(new Date(), 'yyyy-MM-dd') as string;
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 2);
    const toCustom = this.datePipe.transform(futureDate, 'yyyy-MM-dd') as string;

    const data = {
      from: fromCustom,
      to: toCustom
    }
    return this.get<IApiData<IIncomingStudentLessons[]>>(EApiEndpoints.GetIndividualStudentLessons);
  }

  public getPurchases(): Observable<IApiData<IPurchase[]>> {
    return this.get<IApiData<IPurchase[]>>(EApiEndpoints.GetPurchases);
  }
}
