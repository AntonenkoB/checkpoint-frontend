import {ETheme, IOptions} from "@models/common.model";

export enum EUserPages {
  ListUsers = 'list',
  Student = 'student',
  Profile = 'profile',
  Create = 'create',
  User = 'user',
  SelectTeacher = 'create',
}

export enum EUserRole {
  Owner = 'owner',
  Admin = 'admin',
  Teacher = 'teacher',
  Student = 'student',
}

export enum EHeaderMenu {
  Admin = 'admin',
  Teacher = 'teacher',
  Student = 'student',
  Schedule = 'schedule',
}

export enum ERateTabs {
  Price = 'price',
  Salary = 'salary',
}

export interface IUser {
  id: number;
  creative_name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: EUserRole;
  theme: ETheme;
  is_active: boolean;
  onboarding_completed: boolean;
  profile_video: string;
  teacher_description: string;
  teacher_videos: string[];
  created_at: string;
  updated_at: string;
  avatar: string;
  lang?: string;
  teachers?: Partial<IUser[]>;
}

export interface IUserProfile {
  email: string;
  creative_name: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: string;
  temporary_password?: string;
}

export interface IUserUpdate {
  email: string;
  creative_name: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: EUserRole;
  temporary_password?: string;
  teacher_ids?: number[];
}

export const ADMIN_TABS = (): IOptions<EHeaderMenu>[] => [
  {
    value: EHeaderMenu.Student,
    title: "users.student"
  },
  {
    value: EHeaderMenu.Teacher,
    title: "users.teacher"
  },
  {
    value: EHeaderMenu.Admin,
    title: "users.admin"
  },
  {
    value: EHeaderMenu.Schedule,
    title: "schedule.title"
  }
]

export const TEACHER_TABS = (): IOptions<EHeaderMenu>[] => [
  {
    value: EHeaderMenu.Student,
    title: "users.student"
  },
  {
    value: EHeaderMenu.Schedule,
    title: "schedule.title"
  }
]

export const USER_ROLE_TABS = (): IOptions<EHeaderMenu>[] => [
  {
    value: EHeaderMenu.Student,
    title: "users.student"
  },
  {
    value: EHeaderMenu.Teacher,
    title: "users.teacher"
  },
  {
    value: EHeaderMenu.Admin,
    title: "users.admin"
  },
  {
    value: EHeaderMenu.Schedule,
    title: "schedule.title"
  }
]

export const SETTING_RATES_TABS = (): IOptions<ERateTabs>[] => [
  {
    value: ERateTabs.Price,
    title: "rates.price-title"
  },
  {
    value: ERateTabs.Salary,
    title: "rates.salary-title"
  }
]

export const USER_ROLE_ACTIONS = (): IOptions<EUserRole>[] => [
  {
    value: EUserRole.Student,
    title: "users.add-student-btn"
  },
  {
    value: EUserRole.Teacher,
    title: "users.add-teacher-btn"
  },
  {
    value: EUserRole.Admin,
    title: "users.add-admin-btn"
  }
]

export const THEME_ACTIONS = (): IOptions<ETheme>[] => [
  {
    value: ETheme.System,
    title: "profile.theme.system"
  },
  {
    value: ETheme.Light,
    title: "profile.theme.light"
  },
  {
    value: ETheme.Dark,
    title: "profile.theme.dark"
  }
]

export const USER_CREATE_BTN = (): Record<EHeaderMenu, string> => ({
  [EHeaderMenu.Student]: "users.add-student-btn",
  [EHeaderMenu.Teacher]: "users.add-teacher-btn",
  [EHeaderMenu.Admin]: "users.add-admin-btn",
  [EHeaderMenu.Schedule]: "schedule.btn-change-schedule",
});

export const USER_CREATE_TITLE = (): Record<EHeaderMenu, string> => ({
  [EHeaderMenu.Student]: "users.add-student-title",
  [EHeaderMenu.Teacher]: "users.add-teacher-title",
  [EHeaderMenu.Admin]: "users.add-admin-title",
  [EHeaderMenu.Schedule]: "users.admin",
});

export const USER_UPDATE_TITLE = (): Record<EHeaderMenu, string> => ({
  [EHeaderMenu.Student]: "users.update-student-title",
  [EHeaderMenu.Teacher]: "users.update-teacher-title",
  [EHeaderMenu.Admin]: "users.update-admin-title",
  [EHeaderMenu.Schedule]: "users.admin",
});


export const MONTH_LIST = (): IOptions<any>[] => [
  {
    value: 'Квітень',
    title: 'Квітень'
  },
  {
    value: 'Березень',
    title: 'Березень'
  },
  {
    value: 'Лютий',
    title: 'Лютий'
  },
  {
    value: 'Січень',
    title: 'Січень'
  },
  {
    value: 'Грудень',
    title: 'Грудень'
  },
  {
    value: 'Листопад',
    title: 'Листопад'
  },
  {
    value: 'Жовтень',
    title: 'Жовтень'
  },
  {
    value: 'Вересень',
    title: 'Вересень'
  },
  {
    value: 'Серпень',
    title: 'Серпень'
  },
  {
    value: 'Липень',
    title: 'Липень'
  },
  {
    value: 'Червень',
    title: 'Червень'
  },
  {
    value: 'Травень',
    title: 'Травень'
  },
]