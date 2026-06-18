import {ETheme} from "@models/common.model";
import {EMarketPlanType, EPurchaseStatus} from "@market/models/market.model";

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