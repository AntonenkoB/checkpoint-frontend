import {inject, Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {EApiEndpoints, IApiData} from "@models/api.models";
import {IRate} from "@rates/models/rates.model";
import {ApiService} from "@shared/services/api.service";
import {ICancelLesson, ISetLesson, ITransferringLesson} from "@lessons/models/lessons.model";
import {IScheduleItem} from "@schedule/models/schedule.model";

@Injectable({
  providedIn: "root",
})
export class LessonsService extends ApiService {
  public getTeacherSlots(from: string | string[], to: string | string[], teacherId: string): Observable<IApiData<IScheduleItem[]>> {
    return this.get<IApiData<IScheduleItem[]>>([EApiEndpoints.SlotListToRecord, {teacherId}], {from, to});
  }

  public getTIndividualSlots(from: string | string[], to: string | string[]): Observable<IApiData<IScheduleItem[]>> {
    return this.get<IApiData<IScheduleItem[]>>(EApiEndpoints.GetIndividualSlotsToRecord, {from, to});
  }

  public setLessonAtStudent(data: ISetLesson): Observable<IApiData<IScheduleItem>> {
    return this.post<IApiData<IScheduleItem>>([EApiEndpoints.SetLessonAtStudent, {teacherId: data.teacher_id!}], data);
  }

  public setIndividualAtStudent(slot_id: number): Observable<IApiData<IScheduleItem>> {
    return this.post<IApiData<IScheduleItem>>(EApiEndpoints.SetIndividualLessonAtStudent, {slot_id});
  }

  public setLessonAtTeacher(data: ISetLesson): Observable<IApiData<IScheduleItem>> {
    return this.post<IApiData<IScheduleItem>>([EApiEndpoints.SetLessonAtTeacher, {studentId: data.student_id!}], data);
  }

  public setIndividualAsAdmin(data: ISetLesson): Observable<IApiData<IScheduleItem>> {
    return this.post<IApiData<IScheduleItem>>([EApiEndpoints.SetIndividualAtAdmin, {studentId: data.student_id!}], data);
  }

  public cancelLessonAtStudent(data: ICancelLesson): Observable<IApiData<IScheduleItem>> {
    return this.delete<IApiData<IScheduleItem>>([EApiEndpoints.CancelLessonAtStudent, {teacherId: data.teacher_id!, lessonId: data.lesson_id}]);
  }

  public canceledLessonAtTeacher(data: ICancelLesson): Observable<IApiData<IScheduleItem>> {
    return this.delete<IApiData<IScheduleItem>>([EApiEndpoints.CancelLessonAtTeacher, {studentId: data.student_id!, lessonId: data.lesson_id}]);
  }

  public canceledIndividualAtAdmin(data: ICancelLesson): Observable<IApiData<IScheduleItem>> {
    return this.delete<IApiData<IScheduleItem>>([EApiEndpoints.CancelIndividualAtAdmin, {studentId: data.student_id!, lessonId: data.lesson_id}]);
  }

  public canceledIndividualAtStudent(data: ICancelLesson): Observable<IApiData<IScheduleItem>> {
    return this.delete<IApiData<IScheduleItem>>([EApiEndpoints.CancelIndividualAtStudent, {lessonId: data.lesson_id}]);
  }

  public transferringLessonAtStudent(data: ITransferringLesson): Observable<IApiData<IScheduleItem>> {
    return this.patch<IApiData<IScheduleItem>>([EApiEndpoints.TransferringLessonAtStudent, {teacherId: data.teacher_id!, lessonId: data.lesson_id}], {slot_id: data.slot_id});
  }

  public transferringLessonAtTeacher(data: ITransferringLesson): Observable<IApiData<IScheduleItem>> {
    return this.patch<IApiData<IScheduleItem>>([EApiEndpoints.CancelLessonAtTeacher, {studentId: data.student_id!, lessonId: data.lesson_id}], {slot_id: data.slot_id});
  }

  public transferringIndividualAtStudent(data: ITransferringLesson): Observable<IApiData<IScheduleItem>> {
    return this.patch<IApiData<IScheduleItem>>([EApiEndpoints.TransferringIndividualAtStudent, {lessonId: data.lesson_id}], {slot_id: data.slot_id});
  }

  public transferringIndividualAtAdmin(data: ITransferringLesson): Observable<IApiData<IScheduleItem>> {
    return this.patch<IApiData<IScheduleItem>>([EApiEndpoints.TransferringIndividualAtAdmin, {studentId: data.student_id!, lessonId: data.lesson_id}], {slot_id: data.slot_id});
  }
}
