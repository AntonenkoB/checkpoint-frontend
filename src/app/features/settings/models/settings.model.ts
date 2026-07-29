import {EUserRole} from "@models/user.model";
import {EAppPages, TRouter} from "@models/router.model";
import {EStudentPages} from "@student/models/student.model";
import {ERatePages} from "@rates/models/rates.model";
import {getCurrentMonth} from "@shared/utils/date.utils";
import {ELang, ETheme, IOptions} from "@models/common.model";
import {ELessonFlow, ELessonPages} from "@lessons/models/lessons.model";

export enum ESettingsPages {
  List = 'list',
  General = 'general',
  Terms = 'terms',
  Privacy = 'privacy',
}

export interface ISettingsItem {
  label: string;
  link: TRouter[];
  queryParams?: Record<string, string>
}


export const SETTINGS_LIST_MAP: Record<EUserRole, ISettingsItem[]> = {
  [EUserRole.Owner]: [
    {
      label: 'rates.price-title',
      link: [EAppPages.Rates, ERatePages.RateList],
    },
    {
      label: 'rates.salary-title',
      link: [EAppPages.Rates, ERatePages.SalaryList],
      queryParams: {month: getCurrentMonth()}
    },
    {
      label: 'settings.add-free-lessons',
      link: [EAppPages.Lessons, ELessonPages.LessonType],
      queryParams: {lessonsFlow: ELessonFlow.AddFree}
    }
  ],
  [EUserRole.Admin]: [],
  [EUserRole.Teacher]: [],
  [EUserRole.Student]: [
    {
      label: 'student.pages.history-purchases',
      link: [EAppPages.Student, EStudentPages.HistoryPurchases]
    },
    {
      label: 'student.pages.history-lessons',
      link: [EAppPages.Student, EStudentPages.HistoryLessons]
    },
  ],
};

export const LANGS_TAB= (): IOptions<ELang>[] => [
  {
    value: ELang.UA,
    title: "settings.langs.ua"
  },
  {
    value: ELang.EN,
    title: "settings.langs.en"
  },
]

export const THEME_ACTIONS = (): IOptions<ETheme>[] => [
  {
    value: ETheme.System,
    title: "settings.theme.system"
  },
  {
    value: ETheme.Light,
    title: "settings.theme.light"
  },
  {
    value: ETheme.Dark,
    title: "settings.theme.dark"
  }
]

export const NOTIFICATIONS_ENABLE_TAB= (): IOptions<number>[] => [
  {
    value: 1,
    title: "notification.enabled"
  },
  {
    value: 0,
    title: "notification.disabled"
  },
]

export const NOTIFICATIONS_REMAINDER_TAB= (): IOptions<number>[] => [
  {
    value: 1,
    title: "notification.reminder.hours"
  },
  {
    value: 3,
    title: "notification.reminder.three-hours"
  },
  {
    value: 5,
    title: "notification.reminder.five-hours"
  },
  {
    value: 24,
    title: "notification.reminder.day"
  },
  {
    value: 0,
    title: "notification.reminder.no-remind"
  },
]
