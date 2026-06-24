import {IOptions} from "@models/common.model";
import {ITimeRange} from "@schedule/models/schedule.model";
import {IUser, EUserRole} from "@models/user.model";

export enum EUserPages {
  ListUsers = 'list',
  Student = 'student',
  CreateUser = 'create',
  UpdateUser = 'update',
  User = 'user',
}

export enum EHeaderMenu {
  Admin = 'admin',
  Teacher = 'teacher',
  Student = 'student',
  Schedule = 'schedule',
  Salary = 'salary',
}

export enum ERateTabs {
  Price = 'price',
  Salary = 'salary',
  AllTeaches = 'all-teachers',
}

export interface IUserProfile {
  email: string;
  creative_name: string;
  first_name: string;
  last_name: string;
  phone: string;
  roles: EUserRole[];
  temporary_password?: string;
}

export interface IUserUpdate {
  id?: number;
  email: string;
  creative_name: string;
  first_name: string;
  last_name: string;
  phone: string;
  roles: EUserRole[];
  temporary_password?: string;
  teacher_ids?: number[];
}

export interface IStudentLesson {
  id: number;
  date: string;
  teacher: IUser;
  time: ITimeRange
}

export const CREATABLE_ROLES_MAP: Record<EUserRole, EUserRole[]> = {
  [EUserRole.Owner]: [EUserRole.Admin, EUserRole.Teacher, EUserRole.Student],
  [EUserRole.Admin]: [EUserRole.Teacher, EUserRole.Student],
  [EUserRole.Teacher]: [EUserRole.Student],
  [EUserRole.Student]: [],
};

export const ADMIN_TABS = (): IOptions<EHeaderMenu>[] => [
  {
    value: EHeaderMenu.Schedule,
    title: "schedule.title"
  },
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
]

export const TEACHER_TABS = (): IOptions<EHeaderMenu>[] => [
  {
    value: EHeaderMenu.Schedule,
    title: "schedule.title"
  },
  {
    value: EHeaderMenu.Student,
    title: "users.student"
  },
  {
    value: EHeaderMenu.Salary,
    title: "salary.title"
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
    value: ERateTabs.AllTeaches,
    title: "rates.all-teachers-title"
  },
  {
    value: ERateTabs.Price,
    title: "rates.price-title"
  },
  {
    value: ERateTabs.Salary,
    title: "rates.salary-title"
  }
]

export const USER_CREATE_BTN = (): Record<EHeaderMenu, string> => ({
  [EHeaderMenu.Student]: "users.add-student-btn",
  [EHeaderMenu.Teacher]: "users.add-teacher-btn",
  [EHeaderMenu.Admin]: "users.add-admin-btn",
  [EHeaderMenu.Schedule]: "schedule.btn-change-schedule",
  [EHeaderMenu.Salary]: "schedule.btn-change-schedule",
});

export const USER_CREATE_TITLE = (): Record<EHeaderMenu, string> => ({
  [EHeaderMenu.Student]: "users.add-student-title",
  [EHeaderMenu.Teacher]: "users.add-teacher-title",
  [EHeaderMenu.Admin]: "users.add-admin-title",
  [EHeaderMenu.Schedule]: "users.admin",
  [EHeaderMenu.Salary]: "users.admin",
});

export const USER_UPDATE_TITLE = (): Record<EHeaderMenu, string> => ({
  [EHeaderMenu.Student]: "users.update-student-title",
  [EHeaderMenu.Teacher]: "users.update-teacher-title",
  [EHeaderMenu.Admin]: "users.update-admin-title",
  [EHeaderMenu.Schedule]: "users.admin",
  [EHeaderMenu.Salary]: "users.admin",
});
