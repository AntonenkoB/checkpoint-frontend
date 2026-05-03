import {ETheme, IOptions} from "@models/common.model";

export enum ESchedulePages {
  List = 'list',
  RecordStudent = 'record-student',
  RecordTime = 'record-time',
  TransferringLesson = 'transferring',
  LessonCanceled = 'canceled'
}

export const TIME_LIST = [
  '10-11',
  '11-12',
  '12-13',
  '13-14',
  '14-15',
  '15-16',
  '16-17',
  '17-18',
  '18-19',
  '19-20',
  '20-21',
  '21-22',
]

export const WEEK_SHORT_LIST = [
  'Пн',
  'Вт',
  'Ср',
  'Чт',
  'Пт',
  'Сб',
  'Нд',
]

export enum EScheduleType {
  Weekly = 'weekly',
  OneTime = 'one-time'
}

export const SCHEDULE_TYPE_TABS = (): IOptions<EScheduleType>[] => [
  {
    value: EScheduleType.Weekly,
    title: "schedule.type.weekly"
  },
  {
    value: EScheduleType.OneTime,
    title: "schedule.type.one-time"
  },
];
