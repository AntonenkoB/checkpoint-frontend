import {IUser} from "@models/user.model";

export enum ERatePages {
  RateList = 'rate-list',
  RateItem = 'rate-item',
  Salary = 'salary',
  SalaryList = 'salary-list',
  SalaryItem = 'salary-item',
}

export enum ERatesType {
  Single = 'single',
  Subscription = 'subscription'
}

export interface IRate {
  id: number;
  type: ERatesType;
  lessons_per_unit: number;
  price: number;
  is_active: boolean;
  teacher_amount?: number | string;
  school_amount?: number | string;
  teacher: IUser;
}

export interface ICreateRate {
  teacher_id: number;
  type: ERatesType;
  teacher_amount: number | string;
  school_amount: number | string;
}

export interface IUpdateRate {
  teacher_amount?: number | string | null;
  school_amount: number | string;
}

export interface ITeacherRateGroup {
  teacher: IUser;
  id: number;
  plans: ITeacherRatePlansGroup[]
}

export interface ITeacherRatePlansGroup {
  type: ERatesType;
  teacher_amount: number | string;
  school_amount: number | string;
}

export interface ISalary {
  teacher: IUser;
  total_income: number;
  teacher_earned: number;
  school_earned: number;
  purchases: ITransaction[];
}

export interface ITransaction {
  purchased_at: string;
  student: IUser;
  type: ERatesType;
  lessons_total: number;
  teacher_earned: number;
  school_earned: number;
  price_paid: number;
}

export interface IPurchase {
  id: number;
  type: ERatesType;
  quantity: number;
  lessons_total: number;
  lessons_remaining: number;
  price_paid: number;
  reschedules_used: number;
  status: string;
  purchased_at: string;
  activated_at: string;
  expires_at: string;
  teacher: IUser;
  plan: IRate;
}