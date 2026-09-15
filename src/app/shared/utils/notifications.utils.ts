import {
  ENotificationAction,
  ENotificationType,
  NOTIFICATION_BOOKED_TYPES,
  NOTIFICATION_CANCELLED_TYPES,
  NOTIFICATION_EXPIRED_TYPES,
  NOTIFICATION_REMAINDER_TYPES,
  NOTIFICATION_RESCHEDULED_TYPES
} from "@notifacations/models/notifications.model";

export function getNotificationAction(type: ENotificationType): ENotificationAction {
  if (NOTIFICATION_BOOKED_TYPES.includes(type)) return ENotificationAction.Booked;
  if (
    NOTIFICATION_CANCELLED_TYPES.includes(type) || NOTIFICATION_EXPIRED_TYPES.includes(type)
  ) return ENotificationAction.Cancelled;
  if (NOTIFICATION_RESCHEDULED_TYPES.includes(type)) return ENotificationAction.Rescheduled;
  if (NOTIFICATION_REMAINDER_TYPES.includes(type)) return ENotificationAction.Reminder;
  return ENotificationAction.Unknown;
}