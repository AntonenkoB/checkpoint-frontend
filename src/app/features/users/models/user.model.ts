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

export const USER_ROLE_TABS = (): IOptions<EUserRole>[] => [
  {
    value: EUserRole.Student,
    title: "users.student"
  },
  {
    value: EUserRole.Teacher,
    title: "users.teacher"
  },
  {
    value: EUserRole.Admin,
    title: "users.admin"
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

export const USER_CREATE_BTN = (): Record<EUserRole, string> => ({
  [EUserRole.Student]: "users.add-student-btn",
  [EUserRole.Teacher]: "users.add-teacher-btn",
  [EUserRole.Admin]: "users.add-admin-btn",
  [EUserRole.Owner]: "users.add-admin-btn",
});

export const USER_CREATE_TITLE = (): Record<EUserRole, string> => ({
  [EUserRole.Student]: "users.add-student-title",
  [EUserRole.Teacher]: "users.add-teacher-title",
  [EUserRole.Admin]: "users.add-admin-title",
  [EUserRole.Owner]: "users.admin",
});

export const USER_UPDATE_TITLE = (): Record<EUserRole, string> => ({
  [EUserRole.Student]: "users.update-student-title",
  [EUserRole.Teacher]: "users.update-teacher-title",
  [EUserRole.Admin]: "users.update-admin-title",
  [EUserRole.Owner]: "users.admin",
});