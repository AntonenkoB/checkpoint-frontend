import { Injectable } from "@angular/core";
import {ApiService} from "@shared/services/api.service";
import {Observable} from "rxjs";
import {EApiEndpoints, IApiData} from "@models/api.models";
import {IMarketPurchaseLessons, IPaymentInvoice, IPaymentSuccess} from "../models/market.model";
import {IRate} from "@rates/models/rates.model";

@Injectable({
  providedIn: "root",
})
export class MarketService extends ApiService {
  public getRate(teacherId: string): Observable<IApiData<IRate[]>> {
    return this.get<IApiData<IRate[]>>([EApiEndpoints.GetTeacherPlans, { teacher_id: teacherId }]);
  }

  public getIndividualRate(): Observable<IApiData<IRate[]>> {
    return this.get<IApiData<IRate[]>>(EApiEndpoints.GetIndividualRate);
  }

  public getPayment(paymentId: string): Observable<IApiData<IPaymentSuccess>> {
    return this.get<IApiData<IPaymentSuccess>>([EApiEndpoints.GetPaymentLesson, { paymentId: paymentId }]);
  }

  public purchaseLessons(data: IMarketPurchaseLessons): Observable<IApiData<IPaymentSuccess>> {
    return this.post<IApiData<IPaymentSuccess>>(EApiEndpoints.PurchaseLessons, data);
  }

  public paymentLessons(data: IMarketPurchaseLessons): Observable<IApiData<IPaymentInvoice>> {
    return this.post<IApiData<IPaymentInvoice>>(EApiEndpoints.PaymentLessons, data);
  }

  public addFreeLessons(data: IMarketPurchaseLessons): Observable<IApiData<IPaymentSuccess>> {
    return this.post<IApiData<IPaymentSuccess>>([EApiEndpoints.AddFreeLessonsForStudent, {studentId: +data.student_id!}], data);
  }
}
