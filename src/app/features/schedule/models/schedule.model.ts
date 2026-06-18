import {ETheme, IOptions} from "@models/common.model";
import {IUser} from "@models/user.model";

export enum ESchedulePages {
  List = 'list',
  RecordStudent = 'record-student',
  RecordTime = 'record-time',
  SelectTeacher = 'select-teacher'
}

export interface IScheduleItemToDate {
  date: string;
  slots: IScheduleItem[];
}

export interface IScheduleItem {
  id: number;
  date: string;
  time: ITimeRange;
  source: EScheduleSource;
  rooms_free: number;
  lesson: ILesson;
  teacher?: IUser;
  student?: IUser;
}

export interface ITimeRange {
  from: number;
  to: number;
}

export enum EScheduleSource {
  Weekly = 'weekly',
  Manual = 'manual'
}

export interface ILesson {
  id: number;
  student: IUser;
}

export interface IWeeklyScheduleItem {
  id: number;
  day_of_week: EDayOfWeek;
  time: ITimeRange;
}

export enum EDayOfWeek {
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6,
  Sunday = 7
}
export const TIME_LIST: ITimeRange[] = [
  { from: 10, to: 11 },
  { from: 11, to: 12 },
  { from: 12, to: 13 },
  { from: 13, to: 14 },
  { from: 14, to: 15 },
  { from: 15, to: 16 },
  { from: 16, to: 17 },
  { from: 17, to: 18 },
  { from: 18, to: 19 },
  { from: 19, to: 20 },
  { from: 20, to: 21 },
  { from: 21, to: 22 }
] as const;


export const WEEK_SHORT_LIST = [
  { value: EDayOfWeek.Monday, title: 'Пн' },
  { value: EDayOfWeek.Tuesday, title: 'Вт' },
  { value: EDayOfWeek.Wednesday, title: 'Ср' },
  { value: EDayOfWeek.Thursday, title: 'Чт' },
  { value: EDayOfWeek.Friday, title: 'Пт' },
  { value: EDayOfWeek.Saturday, title: 'Сб' },
  { value: EDayOfWeek.Sunday, title: 'Нд' }
] as const;

export enum EScheduleType {
  Weekly = 'weekly',
  OneTime = 'one-time'
}

export const SCHEDULE_TYPE_TABS = (): IOptions<EScheduleType>[] => [
  {
    value: EScheduleType.OneTime,
    title: "schedule.type.one-time"
  },
  {
    value: EScheduleType.Weekly,
    title: "schedule.type.weekly"
  },
];
