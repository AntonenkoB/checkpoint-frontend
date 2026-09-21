import {IUser} from "@models/user.model";

export enum EMarketPages {
  LessonsType = 'lessons-type',
  Teachers = 'teachers',
  Payment = 'payment',
  PaymentType = 'payment-type',
  PaymentSuccess = 'payment-success'
}

export enum EMarketPlanType {
  Single = 'single',
  Subscription = 'subscription',
}

export enum EMarketPaymentType {
  Card = 'card',
  Cash = 'cash',
  Free = 'free',
}

export enum EPurchaseStatus {
  Pending = 'pending',
  Active = 'active',
  Expired = 'expired',
}

export type TPaymentStatus = 'pending' | 'success' | 'failed';

export interface IMarketPurchaseLessons {
  "plan_id": number,
  "quantity": number
  "student_id"?: number,
  "payment_method"?: EMarketPaymentType,
}
export const SELECTED_LESSONS_TYPE = (): Record<EMarketPlanType, string> => ({
  [EMarketPlanType.Single]: "market.select-lessons-count",
  [EMarketPlanType.Subscription]: "market.select-abonnement-count",
});

export interface IPaymentInvoice {
  id: number;
  status: TPaymentStatus;
  amount: number;
  currency: number;
  quantity: number;
  page_url: string;
  app_url: string;
  expires_at: string;
  paid_at: string | null;
  failure_reason: string | null;
  plan: IMarketPlan;
  purchase: IPaymentSuccess;
  payment_method?: EMarketPaymentType;
  has_receipt?: boolean;
  activation_deadline?: string;
}

export interface IPaymentSuccess {
  id: number;
  type: EMarketPlanType;
  quantity: number;
  lessons_total: number;
  lessons_remaining: number;
  price_paid: number;
  reschedules_used: number;
  status: TPaymentStatus;
  purchased_at: string;
  activated_at: string;
  expires_at: string;
  teacher: IUser;
  purchase?: IPaymentSuccess;
  plan: IMarketPlan;
}

export interface IMarketPlan {
  id: number;
  type: EMarketPlanType;
  lessons_per_unit: number;
  price: number;
  is_active: boolean;
  teacher: IUser;
  teacher_amount?: number;
  school_amount?: number;
}


