import {ETheme, IOptions} from "@models/common.model";


export enum EStudentProfileTabs {
  Purchases = 'purchases',
  Lessons = 'lessons'
}

export const STUDENT_PROFILE_TABS = (): IOptions<EStudentProfileTabs>[] => [
  {
    value: EStudentProfileTabs.Purchases,
    title: "student.pages.history-purchases"
  },
  {
    value: EStudentProfileTabs.Lessons,
    title: "student.pages.history-lessons"
  },
]
