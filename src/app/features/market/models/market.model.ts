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
}
export const SELECTED_LESSONS_TYPE = (): Record<EMarketPlanType, string> => ({
  [EMarketPlanType.Single]: "market.select-lessons-count",
  [EMarketPlanType.Subscription]: "market.select-abonnement-count",
});

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
  plan: IMarketPlan;
}

export interface IMarketPlan {
  id: number;
  type: EMarketPlanType;
  lessons_per_unit: number;
  price: number;
  is_active: boolean;
  teacher: IUser;
}


