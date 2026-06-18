import {inject, Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {EApiEndpoints, IApiData} from "@models/api.models";
import {ApiService} from "@shared/services/api.service";
import {IStudentLesson, IUserProfile, IUserUpdate} from "../models/user.model";
import {IUser, EUserRole} from "@models/user.model";

import {DatePipe} from "@angular/common";

@Injectable({
  providedIn: 'root',
})
export class UserService extends ApiService {
  private datePipe = inject(DatePipe);


  public getAllUsers(role: EUserRole, page = 1, search = ''): Observable<IApiData<IUser[]>> {
    return this.get<IApiData<IUser[]>>(EApiEndpoints.ListUsers, { role, page, search, per_page: 100 });
  }

  public createUser(data: IUserProfile): Observable<IApiData<IUser>> {
    return this.post<IApiData<IUser>>(EApiEndpoints.CreateUser, data);
  }

  public getUser(userId: number): Observable<IApiData<IUser>> {
    return this.get<IApiData<IUser>>([EApiEndpoints.GetUser, { userId }]);
  }

  public updateUser(data: IUserUpdate): Observable<IApiData<IUser>> {
    return this.put<IApiData<IUser>>([EApiEndpoints.UpdateUser, {userId: data.id!.toString()}], data);
  }

  public deleteUser(id: string): Observable<IApiData<IUser>> {
    return this.delete<IApiData<IUser>>([EApiEndpoints.DeleteUser, {id}]);
  }

  public getLessons(): Observable<IApiData<IStudentLesson[]>> {
    const from = this.datePipe.transform(new Date(), 'yyyy-MM-dd') as string;

    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 2);
    const to = this.datePipe.transform(futureDate, 'yyyy-MM-dd') as string;

    const data = {
      from,
      to
    }
    return this.get<IApiData<IStudentLesson[]>>(EApiEndpoints.GetLessons, data);
  }

  public getStudentsList(search = '', page = 1): Observable<IApiData<IUser[]>> {
    return this.get<IApiData<IUser[]>>(EApiEndpoints.GetStudentsList, { page, search, per_page: 100 });
  }

  public getStudent(studentId: number): Observable<IApiData<IUser>> {
    return this.get<IApiData<IUser>>([EApiEndpoints.GetStudent, { studentId }]);
  }

  public createStudent(data: IUserUpdate): Observable<IApiData<IUser>> {
    return this.post<IApiData<IUser>>(EApiEndpoints.CreateStudent, data);
  }

  public updateStudent(data: IUserUpdate): Observable<IApiData<IUser>> {
    return this.put<IApiData<IUser>>([EApiEndpoints.UpdateStudent, { studentId: data.id! }], data);
  }

  public getTeachers(): Observable<IApiData<IUser[]>> {
    return this.get<IApiData<IUser[]>>(EApiEndpoints.GetTeachers);
  }


  public getTeacher(teacherId: number): Observable<IApiData<IUser>> {
    return this.get<IApiData<IUser>>([EApiEndpoints.GetTeacher, { teacherId }]);
  }
}
