import {ETheme, IOptions} from "@models/common.model";
import {EMarketPlanType, EPurchaseStatus} from "@market/models/market.model";

export enum EUserRole {
  Owner = 'owner',
  Admin = 'admin',
  Teacher = 'teacher',
  Student = 'student',
}

export const USER_ROLE_OPTIONS: IOptions<EUserRole>[] = [
  { value: EUserRole.Student, title: 'common.roles.student' },
  { value: EUserRole.Teacher, title: 'common.roles.teacher' },
  { value: EUserRole.Admin, title: 'common.roles.admin' },
  { value: EUserRole.Owner, title: 'common.roles.owner' },
];

export interface IUser {
  id: number;
  creative_name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  roles: EUserRole[];
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
  purchases?: IProfilePurchases[];
}

export interface IProfilePurchases {
  id: number;
  status: EPurchaseStatus;
  type: EMarketPlanType;
  lessons_remaining: number;
  expires_at: string;
  teacher: Partial<IUser>;
}