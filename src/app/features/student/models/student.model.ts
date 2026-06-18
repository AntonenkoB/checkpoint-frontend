import {ITimeRange} from "@schedule/models/schedule.model";
import {IUser} from "@models/user.model";
import {ILesson} from "@models/lesson.model";

export enum EStudentPages {
  StudentDashboard = 'dashboard',
  HistoryPurchases = 'purchases',
  HistoryLessons = 'lessons',
}

export interface IIncomingStudentLessons {
  id: number;
  date: string;
  time: ITimeRange;
  teacher: IUser;
}

export interface IGroupedStudentLessons {
  teacher: IUser;
  lessons: ILesson[];
}

export interface IWeekGroupStudentLessons {
  label: string;
  week: Array<{
    teacher: IUser;
    lessons: ILesson[];
  }>
}
