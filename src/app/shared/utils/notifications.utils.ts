import {
  ENotificationAction,
  ENotificationType,
  NOTIFICATION_BOOKED_TYPES,
  NOTIFICATION_CANCELLED_TYPES, NOTIFICATION_RESCHEDULED_TYPES
} from "@notifacations/models/notifications.model";

export function getNotificationAction(type: ENotificationType): ENotificationAction {
  if (NOTIFICATION_BOOKED_TYPES.includes(type)) return ENotificationAction.Booked;
  if (NOTIFICATION_CANCELLED_TYPES.includes(type)) return ENotificationAction.Cancelled;
  if (NOTIFICATION_RESCHEDULED_TYPES.includes(type)) return ENotificationAction.Rescheduled;
  if (type === ENotificationType.LessonReminder) return ENotificationAction.Reminder;
  return ENotificationAction.Unknown;
}