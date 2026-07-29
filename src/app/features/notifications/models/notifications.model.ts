import {ITimeRange} from "@schedule/models/schedule.model";
import {EUserRole, IUser} from "@models/user.model";

export enum ENotificationPage {
  Notifications = 'notifications',
}

export enum ENotificationType {
  // Teacher events (student actions)
  StudentBooked = 'student_booked',
  StudentCancelled = 'student_cancelled',
  StudentRescheduled = 'student_rescheduled',

  IndividualStudentBooked = 'individual_student_booked',
  IndividualStudentCancelled = 'individual_student_cancelled',
  IndividualStudentRescheduled = 'individual_student_rescheduled',

  // Student requests
  LessonBookRequested = 'lesson_book_requested',
  LessonCancelRequested = 'lesson_cancel_requested',
  LessonRescheduleRequested = 'lesson_reschedule_requested',

  IndividualBookRequested = 'individual_book_requested',
  IndividualCancelRequested = 'individual_cancel_requested',
  IndividualRescheduleRequested = 'individual_reschedule_requested',

  // Lesson confirmations/rejections
  LessonBookConfirmed = 'lesson_book_confirmed',
  LessonBookRejected = 'lesson_book_rejected',
  LessonBookFailed = 'lesson_book_failed',

  LessonCancelConfirmed = 'lesson_cancel_confirmed',
  LessonCancelRejected = 'lesson_cancel_rejected',
  LessonCancelFailed = 'lesson_cancel_failed',

  LessonRescheduleConfirmed = 'lesson_reschedule_confirmed',
  LessonRescheduleRejected = 'lesson_reschedule_rejected',
  LessonRescheduleFailed = 'lesson_reschedule_failed',

  // Individual confirmations/rejections
  IndividualBookConfirmed = 'individual_book_confirmed',
  IndividualBookRejected = 'individual_book_rejected',
  IndividualBookFailed = 'individual_book_failed',

  IndividualCancelConfirmed = 'individual_cancel_confirmed',
  IndividualCancelRejected = 'individual_cancel_rejected',
  IndividualCancelFailed = 'individual_cancel_failed',

  IndividualRescheduleConfirmed = 'individual_reschedule_confirmed',
  IndividualRescheduleRejected = 'individual_reschedule_rejected',
  IndividualRescheduleFailed = 'individual_reschedule_failed',

  // Reminder
  LessonReminder = 'lesson_reminder',
}

export enum ENotificationAction {
  Booked = 'booked',
  Cancelled = 'cancelled',
  Rescheduled = 'rescheduled',
  Reminder = 'reminder',
  Unknown = 'unknown',
}

export const NOTIFICATION_BOOKED_TYPES = [
  ENotificationType.StudentBooked,
  ENotificationType.IndividualStudentBooked,
  ENotificationType.LessonBookRequested,
  ENotificationType.IndividualBookRequested,
  ENotificationType.LessonBookConfirmed,
  ENotificationType.IndividualBookConfirmed,
  ENotificationType.LessonBookFailed,
  ENotificationType.IndividualBookFailed,

  ENotificationType.LessonRescheduleConfirmed,
  ENotificationType.IndividualRescheduleConfirmed,
  ENotificationType.LessonCancelConfirmed,
  ENotificationType.IndividualCancelConfirmed,
];

export const NOTIFICATION_CANCELLED_TYPES = [
  ENotificationType.StudentCancelled,
  ENotificationType.IndividualStudentCancelled,
  ENotificationType.LessonCancelRequested,
  ENotificationType.IndividualCancelRequested,
  ENotificationType.LessonCancelFailed,
  ENotificationType.IndividualCancelFailed,

  ENotificationType.LessonBookRejected,
  ENotificationType.IndividualBookRejected,
  ENotificationType.LessonCancelRejected,
  ENotificationType.IndividualCancelRejected,
];

export const NOTIFICATION_RESCHEDULED_TYPES = [
  ENotificationType.StudentRescheduled,
  ENotificationType.IndividualStudentRescheduled,
  ENotificationType.LessonRescheduleRequested,
  ENotificationType.IndividualRescheduleRequested,
  ENotificationType.LessonRescheduleFailed,
  ENotificationType.IndividualRescheduleFailed,
  ENotificationType.LessonRescheduleRejected,
  ENotificationType.IndividualRescheduleRejected,
];

export enum ENotificationStatus {
  Unread = 'unread',
  Read = 'read',
}

export interface INotificationPayload {
  date: string;
  time: ITimeRange;
  previous_date: string;
  previous_time: ITimeRange;
  lesson_id: number;
  student_id: number;
}

export interface INotification {
  id: number;
  type: ENotificationType;
  requires_confirmation: boolean;
  payload: INotificationPayload;
  status: ENotificationStatus;
  sender: IUser;
  resolved_at: string | null;
  created_at: string;
}

export interface INotificationResponse {
  data: INotification[];
}

export interface INotificationCount {
  book_count: number;
  reschedule_count: number;
  cancel_count: number;
  reminder_count: number;
}

export interface INotificationsParams {
  role: EUserRole;
  status?: ENotificationStatus;
}

