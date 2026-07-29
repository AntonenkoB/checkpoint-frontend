import {ERoutParams} from "@models/router.model";

export enum EApiEndpoints {
  CheckUser = 'auth/check-identifier',
  Login = 'auth/login',
  ForgotPassword = 'auth/password/forgot',
  CheckIdentifier = 'auth/password/verify-code',
  ResetPassword = 'auth/password/reset',
  RefreshToken = 'auth/refresh',
  CreatePassword = 'create-password',
  CompleteOnboarding = 'profile/complete-onboarding',

  // profile
  GetProfile = 'profile',
  UpdateProfile = 'profile',
  AddAvatar = 'profile/avatar',
  DeleteAvatar = 'profile/avatar',
  DeleteAccount = 'profile/avatar',

  // users
  ListUsers = 'users',
  CreateUser = 'users',
  GetChangeUser = `users/:${ERoutParams.UserId}`,
  GetUser = `users/:${ERoutParams.UserId}`,
  UpdateUser = `users/:${ERoutParams.UserId}`,
  DeleteUser = `users/:${ERoutParams.UserId}`,

  // students
  GetStudentsList = 'students',
  CreateStudent = 'students',
  UpdateStudent = `students/:${ERoutParams.StudentId}`,
  GetStudent = `students/:${ERoutParams.StudentId}`,

  // teachers
  GetTeachers = 'teachers',
  GetTeacher = `students/:${ERoutParams.TeacherId}`,
  GetPurchases = 'purchases',

  // rates
  AllRates = 'plans',
  GetRate = `plans`,
  GetIndividualRate = `individual/plans`,
  GetTeacherPlans = `teachers/:${ERoutParams.TeacherId}/plans`,
  CreteRate = `plans`,
  UpdateRates = `plans/:${ERoutParams.PlanId}`,

  // Salary
  Salary = 'salary',

  // schedule
  GetScheduleWeek = 'schedule/weekly',
  AddScheduleWeek = 'schedule/weekly',
  DeleteScheduleWeek = `schedule/weekly/:${ERoutParams.StudentId}`,
  GetScheduleSlots = 'schedule/slots',
  AddScheduleSlots = 'schedule/slots',
  DeleteScheduleSlots = `schedule/slots/:${ERoutParams.StudentId}`,

  GetIndividualScheduleWeek = 'schedule/individual/weekly',
  AddIndividualScheduleWeek = 'schedule/individual/weekly',
  DeleteIndividualScheduleWeek = `schedule/individual/weekly/:${ERoutParams.StudentId}`,

  GetIndividualScheduleSlots = 'schedule/individual/slots',
  GetAllScheduleSlots = 'schedule/overview',
  AddIndividualScheduleSlots = 'schedule/individual/slots',
  DeleteIndividualScheduleSlots = `schedule/individual/slots/:${ERoutParams.StudentId}`,

  // lessons
  GetLessons = 'lessons',
  SetLessons = 'lessons',
  GetStudentLessons = `teachers/lessons`,
  SetLessonAtStudent = `teachers/:${ERoutParams.TeacherId}/lessons`,
  CancelLessonAtStudent = `teachers/:${ERoutParams.TeacherId}/lessons/:${ERoutParams.LessonId}`,
  TransferringLessonAtStudent = `teachers/:${ERoutParams.TeacherId}/lessons/:${ERoutParams.LessonId}`,
  GetStudentLessonsToTeacher = `teachers/:${ERoutParams.TeacherId}/lessons`,

  GetIndividualStudentLessons = `individual/lessons`,
  SetIndividualLessonAtStudent = `individual/lessons`,
  CancelIndividualAtStudent = `individual/lessons/:${ERoutParams.LessonId}`,
  TransferringIndividualAtStudent = `individual/lessons/:${ERoutParams.LessonId}`,

  SetLessonAtTeacher = `students/:${ERoutParams.StudentId}/lessons`,
  CancelLessonAtTeacher = `students/:${ERoutParams.StudentId}/lessons/:${ERoutParams.LessonId}`,
  TransferringLessonAtTeacher = `students/:${ERoutParams.StudentId}/lessons/:${ERoutParams.LessonId}`,

  SetIndividualAtAdmin = `students/:${ERoutParams.StudentId}/individual/lessons`,
  CancelIndividualAtAdmin = `students/:${ERoutParams.StudentId}/individual/lessons/:${ERoutParams.LessonId}`,
  TransferringIndividualAtAdmin = `students/:${ERoutParams.StudentId}/individual/lessons/:${ERoutParams.LessonId}`,
  AddFreeLessonsForStudent = `students/:${ERoutParams.StudentId}/purchases`,

  // market
  PurchaseLessons = 'purchases',

  // record
  SlotListToRecord = `teachers/:${ERoutParams.TeacherId}/slots`,
  GetIndividualSlotsToRecord = `individual/slots`,

  // notifications
  GetNotifications = 'notifications',
  GetNotificationCount = 'notifications/unread-count',
  ReedNotification = `notifications/:${ERoutParams.NotificationId}/read`,
  ConfirmNotification = `notifications/:${ERoutParams.NotificationId}/confirm`,
  RejectNotification = `notifications/:${ERoutParams.NotificationId}/reject`,
  SetDeviceTokens = 'profile/device-tokens',
  DeleteDeviceTokens = 'profile/device-tokens',
}

export type IApiUrlParams =  Record<string | number, string | number>;
export type IApiUrl =  EApiEndpoints | [EApiEndpoints, IApiUrlParams];

export interface IApiData<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  meta?: IPagination;
}

export interface IPagination {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
}

export const DEFAULT_PAGINATION = {
  currentPage: 0,
  lastPage: 0,
  perPage: 0,
  total: 0,
}