import {EAuthPages} from "../../features/auth/models/router.model";
import {EUserPages} from "../../features/users/models/user.model";
import {ESchedulePages} from "../../features/schedule/models/schedule.model";
import {ERatePages} from "@rates/models/rates.model";
import {EMarketPages} from "@market/models/market.model";
import {ELessonPages} from "@lessons/models/lessons.model";
import {EStudentPages} from "../../features/student/models/student.model";

export enum EAppPages {
  Auth = 'auth',
  Users = 'users',
  Schedule = 'schedule',
  Market = 'market',
  Rates = 'rates',
  Lessons = 'lessons',
  Student = 'student',
  Profile = 'profile',
  Settings = 'settings',
  Notifications = 'notifications',
}

export enum ERoutParams {
  UserId = 'userId',
  StudentId = 'studentId',
  TeacherId = 'teacherId',
  LessonId = 'lessonId',
  PlanId = 'id',
  SlotId = 'id',
  NotificationId = 'id',
}

export enum EQueryParams {
  Month = 'month',
  From = 'from',
  To = 'to',
  Date = 'to',
  Search = 'search',
  LessonsFlow = 'lessonsFlow'
}

export type TRouter =
  EAppPages
  | EAuthPages
  | EUserPages
  | ESchedulePages
  | ERatePages
  | EMarketPages
  | ELessonPages
  | EStudentPages
  | ERoutParams
  | string
  | number
  | null;